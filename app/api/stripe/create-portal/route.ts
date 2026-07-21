/**
 * POST /api/stripe/create-portal
 *
 * Creates a Stripe Billing Portal session for subscription management.
 * Returns the portal URL for redirect.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createPortalSession } from "@/lib/stripe/portal";
import { getOrCreateSubscription } from "@/lib/supabase";

export async function POST() {
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

    if (!sub.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: "No customer record found. Please upgrade first." },
        { status: 400 }
      );
    }

    const returnUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/billing`
      : "http://localhost:3000/billing";

    const portalUrl = await createPortalSession({
      customerId: sub.stripe_customer_id,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      url: portalUrl,
    });
  } catch (error) {
    console.error("Portal creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create portal session.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
