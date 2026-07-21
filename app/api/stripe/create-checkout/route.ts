/**
 * POST /api/stripe/create-checkout
 *
 * Creates a Stripe Checkout Session for the Pro plan.
 * Returns the checkout URL for redirect.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { getOrCreateSubscription } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    // Get or create the subscription to know the user's stripe customer status
    const sub = await getOrCreateSubscription(userId);

    // Get user email from the request body (sent from client via Clerk user)
    const body = await request.json().catch(() => ({}));
    const userEmail = body.email || null;
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { success: false, error: "Pro plan price not configured." },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkout = await createCheckoutSession({
      userId,
      userEmail,
      priceId,
      origin,
    });

    return NextResponse.json({
      success: true,
      url: checkout.url,
      sessionId: checkout.sessionId,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
