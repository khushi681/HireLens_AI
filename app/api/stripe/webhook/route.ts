/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events:
 *   - checkout.session.completed  → provision Pro subscription
 *   - customer.subscription.updated   → sync subscription status
 *   - customer.subscription.deleted   → revert to Free
 *
 * Never trusts the frontend — always verifies Stripe signature.
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  upsertSubscriptionByUser,
  getSubscriptionByStripeId,
  updateSubscriptionByStripeId,
  getSubscriptionByCustomerId,
} from "@/lib/supabase";

const WEBHOOK_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function mapStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case "active": return "active";
    case "past_due": return "past_due";
    case "canceled": return "canceled";
    case "incomplete": return "inactive";
    case "incomplete_expired": return "inactive";
    case "trialing": return "trialing";
    case "unpaid": return "past_due";
    default: return "inactive";
  }
}

function mapPlan(stripeStatus: string): string {
  return stripeStatus === "active" || stripeStatus === "trialing" ? "pro" : "free";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header." },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
      return NextResponse.json(
        { error: "Webhook not configured." },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid signature";
      console.error("Webhook signature verification failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!WEBHOOK_EVENTS.has(event.type)) {
      return NextResponse.json({ received: true });
    }

    // ─── Handle: checkout.session.completed ───────────────────────
    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object as unknown as Record<string, unknown>;

      // Only process subscription checkouts
      if (checkout.mode !== "subscription" || !checkout.subscription) {
        return NextResponse.json({ received: true });
      }

      const metadata = checkout.metadata as Record<string, string> | undefined;
      const userId = (checkout.client_reference_id as string) || metadata?.userId;

      if (!userId) {
        console.error("No userId found in checkout session:", checkout.id);
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      // Fetch the subscription from Stripe to get current period end
      const retrieved = await stripe.subscriptions.retrieve(
        checkout.subscription as string
      );
      const subData = retrieved as unknown as { status: string; current_period_end: number };

      await upsertSubscriptionByUser(userId, {
        plan: "pro",
        subscription_status: mapStatus(subData.status),
        stripe_customer_id: checkout.customer as string,
        stripe_subscription_id: checkout.subscription as string,
        current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
      });

      console.log(`[Webhook] User ${userId} subscribed to Pro`);
      return NextResponse.json({ received: true });
    }

    // ─── Handle: customer.subscription.updated ────────────────────
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as unknown as Record<string, unknown>;
      const subId = sub.id as string;
      const subStatus = sub.status as string;
      const subPeriodEnd = sub.current_period_end as number;
      const subCustomer = sub.customer as string;

      const existing = await getSubscriptionByStripeId(subId);

      if (existing) {
        const status = mapStatus(subStatus);
        const plan = mapPlan(subStatus);

        await updateSubscriptionByStripeId(subId, {
          plan,
          subscription_status: status,
          current_period_end: new Date(subPeriodEnd * 1000).toISOString(),
        });

        console.log(`[Webhook] Subscription ${subId} updated to ${plan}/${status}`);
      } else {
        // Try looking up by customer ID
        const byCustomer = await getSubscriptionByCustomerId(subCustomer);
        if (byCustomer && subId) {
          const status = mapStatus(subStatus);
          const plan = mapPlan(subStatus);

          await updateSubscriptionByStripeId(subId, {
            plan,
            subscription_status: status,
            current_period_end: new Date(subPeriodEnd * 1000).toISOString(),
          });
        }
      }

      return NextResponse.json({ received: true });
    }

    // ─── Handle: customer.subscription.deleted ────────────────────
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as unknown as Record<string, unknown>;
      const subId = sub.id as string;

      await updateSubscriptionByStripeId(subId, {
        plan: "free",
        subscription_status: "canceled",
      });

      console.log(`[Webhook] Subscription ${subId} canceled — reverted to Free`);
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
