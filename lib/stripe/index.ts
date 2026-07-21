/**
 * Stripe server-side client.
 * Used exclusively in API routes.
 */

import Stripe from "stripe";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. " +
      "Please add it to your .env.local file."
    );
  }

  return new Stripe(key, {
    typescript: true,
  });
}

let _client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_client) {
    _client = getStripeClient();
  }
  return _client;
}
