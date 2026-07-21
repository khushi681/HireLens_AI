/**
 * GET /api/subscription
 *
 * Returns the authenticated user's subscription and usage info.
 *
 * Response: { success: true, data: { subscription, usage } }
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateSubscription, getDailyAnalysisCount } from "@/lib/supabase";
import type { Subscription } from "@/types";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const sub = await getOrCreateSubscription(userId);
    const usedToday = await getDailyAnalysisCount(userId);

    const subscription: Subscription = {
      id: sub.id,
      userId: sub.user_id,
      plan: sub.plan as "free" | "pro",
      subscriptionStatus: sub.subscription_status as Subscription["subscriptionStatus"],
      stripeCustomerId: sub.stripe_customer_id,
      stripeSubscriptionId: sub.stripe_subscription_id,
      currentPeriodEnd: sub.current_period_end,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at,
    };

    const limit = sub.plan === "pro" ? Infinity : 3;

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        usage: {
          usedToday,
          limit,
          plan: sub.plan,
        },
      },
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    const message = error instanceof Error ? error.message : "Failed to load subscription.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
