/**
 * Create a Stripe Billing Portal session for managing subscriptions.
 */

import { getStripe } from "./index";

export interface CreatePortalParams {
  customerId: string;
  returnUrl: string;
}

export async function createPortalSession(params: CreatePortalParams): Promise<string | null> {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session.url;
}
