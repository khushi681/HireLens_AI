/**
 * Supabase server client.
 * Used exclusively in API routes (server-side).
 * Auth enforcement happens via Clerk middleware + route-level checks.
 */

import { createClient } from "@supabase/supabase-js";

function getClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing SUPABASE_URL environment variable. " +
      "Please add it to your .env.local file."
    );
  }

  if (!supabaseKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
      "Please add it to your .env.local file."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Singleton pattern — reuse the same client instance across API routes.
 * In serverless environments this prevents connection churn.
 */
let _client: ReturnType<typeof getClient> | null = null;

export function getSupabaseClient() {
  if (!_client) {
    _client = getClient();
  }
  return _client;
}
