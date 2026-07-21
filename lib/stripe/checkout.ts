/**
 * Create a Stripe Checkout Session for Pro plan upgrade.
 */

import { getStripe } from "./index";

export interface CreateCheckoutParams {
  userId: string;
  userEmail?: string | null;
  priceId: string;
  origin: string;
}

export interface CreateCheckoutResult {
  url: string | null;
  sessionId: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CreateCheckoutResult> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    client_reference_id: params.userId,
    customer_email: params.userEmail || undefined,
    subscription_data: {
      metadata: {
        userId: params.userId,
      },
    },
    success_url: `${params.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/billing/cancel`,
    allow_promotion_codes: true,
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
}
