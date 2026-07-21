/**
 * Supabase database service layer.
 * All database operations go through here — never directly in components or route handlers.
 */

import { getSupabaseClient } from "./client";
import type { AnalysisResult } from "@/types";

// ─── Types ──────────────────────────────────────────────────────

export interface SavedAnalysis {
  id: string;
  userId: string;
  resumeName: string;
  jobTitle: string;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  technicalSkills: string[];
  softSkills: string[];
  suggestions: string[];
  interviewReadiness: string;
  createdAt: string;
}

export interface DashboardStats {
  reviewsThisMonth: number;
  averageScore: number;
  totalResumes: number;
}

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Extract a job title from the first meaningful line of a job description.
 * Falls back to "Untitled Position" if no title can be extracted.
 */
export function extractJobTitle(jobDescription: string): string {
  const lines = jobDescription
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (const line of lines) {
    // Look for common title indicators
    const lower = line.toLowerCase();
    if (
      lower.includes("title:") ||
      lower.includes("position:") ||
      lower.includes("role:") ||
      lower.includes("job:")
    ) {
      const title = line.split(/:(.+)/)?.[1]?.trim() || line;
      if (title.length > 2 && title.length <= 120) return title;
    }
  }

  // Fallback: take the first short line (likely the job title)
  for (const line of lines) {
    if (line.length > 3 && line.length <= 100) return line;
  }

  // Last resort: truncate first line
  const first = lines[0] || "";
  return first.length > 80 ? first.slice(0, 77) + "..." : first || "Untitled Position";
}

// ─── Save Analysis ───────────────────────────────────────────────

/**
 * Save a completed analysis to the database.
 * Called after Gemini successfully returns a valid result.
 */
export async function saveAnalysis(params: {
  userId: string;
  resumeName: string;
  jobDescription: string;
  result: AnalysisResult;
}): Promise<SavedAnalysis> {
  const supabase = getSupabaseClient();
  const jobTitle = extractJobTitle(params.jobDescription);

  const { data, error } = await supabase
    .from("analyses")
    .insert({
      user_id: params.userId,
      resume_name: params.resumeName,
      job_title: jobTitle,
      ats_score: params.result.atsScore,
      strengths: params.result.strengths,
      weaknesses: params.result.weaknesses,
      missing_keywords: params.result.missingKeywords,
      technical_skills: params.result.technicalSkills,
      soft_skills: params.result.softSkills,
      suggestions: params.result.suggestions,
      interview_readiness: params.result.interviewReadiness,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save analysis:", error);
    throw new Error("Failed to save analysis to database.");
  }

  return mapRowToSavedAnalysis(data);
}

// ─── Fetch Analyses ──────────────────────────────────────────────

/**
 * Fetch all analyses for a user, newest first.
 */
export async function getUserAnalyses(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ analyses: SavedAnalysis[]; total: number }> {
  const supabase = getSupabaseClient();
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  // Get total count
  const { count: total, error: countError } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) {
    console.error("Failed to count analyses:", countError);
    throw new Error("Failed to load analyses.");
  }

  // Get paginated results
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Failed to fetch analyses:", error);
    throw new Error("Failed to load analyses.");
  }

  return {
    analyses: (data ?? []).map(mapRowToSavedAnalysis),
    total: total ?? 0,
  };
}

/**
 * Fetch a single analysis by ID.
 * Verifies the analysis belongs to the specified user.
 */
export async function getUserAnalysisById(
  analysisId: string,
  userId: string
): Promise<SavedAnalysis | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned — not found or unauthorized
      return null;
    }
    console.error("Failed to fetch analysis:", error);
    throw new Error("Failed to load analysis.");
  }

  return mapRowToSavedAnalysis(data);
}

// ─── Dashboard Stats ─────────────────────────────────────────────

/**
 * Compute dashboard statistics for a user from their stored analyses.
 */
export async function getUserStats(userId: string): Promise<DashboardStats> {
  const supabase = getSupabaseClient();

  // Get current month bounds
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Fetch all analyses for the user (we need score data)
  const { data, error } = await supabase
    .from("analyses")
    .select("ats_score, created_at")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch stats:", error);
    throw new Error("Failed to load dashboard statistics.");
  }

  const allAnalyses = data ?? [];

  // Reviews this month
  const reviewsThisMonth = allAnalyses.filter(
    (a) => a.created_at >= startOfMonth
  ).length;

  // Average ATS score across all analyses
  const totalScore = allAnalyses.reduce((sum, a) => sum + a.ats_score, 0);
  const averageScore = allAnalyses.length > 0
    ? Math.round(totalScore / allAnalyses.length)
    : 0;

  // Total resumes uploaded = total analyses
  const totalResumes = allAnalyses.length;

  return {
    reviewsThisMonth,
    averageScore,
    totalResumes,
  };
}

// ─── Usage Tracking ──────────────────────────────────────────────

/**
 * Get the number of analyses a user has performed this month.
 */
export async function getMonthlyAnalysisCount(userId: string): Promise<number> {
  const supabase = getSupabaseClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth);

  if (error) {
    console.error("Failed to get monthly count:", error);
    throw new Error("Failed to check usage limits.");
  }

  return count ?? 0;
}

/**
 * Get the number of analyses a user has performed today.
 * Used for enforcing daily limits on free accounts.
 */
export async function getDailyAnalysisCount(userId: string): Promise<number> {
  const supabase = getSupabaseClient();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const { count, error } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay);

  if (error) {
    console.error("Failed to get daily count:", error);
    throw new Error("Failed to check usage limits.");
  }

  return count ?? 0;
}

// ─── Subscription Services ───────────────────────────────────────

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get the subscription for a user. Creates a default free row if none exists.
 */
export async function getOrCreateSubscription(userId: string): Promise<SubscriptionRow> {
  const supabase = getSupabaseClient();

  // Try to find existing subscription
  const { data: existing, error: findError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (findError && findError.code !== "PGRST116") {
    console.error("Failed to fetch subscription:", findError);
    throw new Error("Failed to load subscription.");
  }

  if (existing) {
    return existing as SubscriptionRow;
  }

  // Create default free subscription
  const { data: created, error: createError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      plan: "free",
      subscription_status: "inactive",
    })
    .select()
    .single();

  if (createError) {
    console.error("Failed to create subscription:", createError);
    throw new Error("Failed to initialize subscription.");
  }

  return created as SubscriptionRow;
}

/**
 * Get a subscription by Stripe customer ID (for webhook processing).
 */
export async function getSubscriptionByCustomerId(
  customerId: string
): Promise<SubscriptionRow | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Failed to find subscription by customer:", error);
    throw new Error("Failed to find subscription.");
  }

  return data as SubscriptionRow;
}

/**
 * Get a subscription by Stripe subscription ID (for webhook processing).
 */
export async function getSubscriptionByStripeId(
  subscriptionId: string
): Promise<SubscriptionRow | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Failed to find subscription by stripe ID:", error);
    throw new Error("Failed to find subscription.");
  }

  return data as SubscriptionRow;
}

/**
 * Upsert a subscription by user_id (set on checkout completion).
 */
export async function upsertSubscriptionByUser(
  userId: string,
  data: {
    plan: string;
    subscription_status: string;
    stripe_customer_id: string;
    stripe_subscription_id: string;
    current_period_end?: string;
  }
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan: data.plan,
      subscription_status: data.subscription_status,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      current_period_end: data.current_period_end || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to upsert subscription:", error);
    throw new Error("Failed to update subscription.");
  }
}

/**
 * Update subscription plan and status by Stripe subscription ID (for webhook updates).
 */
export async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  data: {
    plan: string;
    subscription_status: string;
    current_period_end?: string;
  }
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: data.plan,
      subscription_status: data.subscription_status,
      current_period_end: data.current_period_end || null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (error) {
    console.error("Failed to update subscription:", error);
    throw new Error("Failed to update subscription.");
  }
}

/**
 * Check if a user can perform an analysis based on their plan and daily usage.
 */
export async function checkAnalysisLimit(userId: string): Promise<{
  allowed: boolean;
  usedToday: number;
  limit: number;
  plan: string;
}> {
  const [sub, usedToday] = await Promise.all([
    getOrCreateSubscription(userId),
    getDailyAnalysisCount(userId),
  ]);

  const plan = sub.plan;
  const limit = plan === "pro" ? Infinity : 3;
  const allowed = usedToday < limit;

  return { allowed, usedToday, limit, plan };
}

// ─── User Settings Services ─────────────────────────────────────

export interface UserSettingsRow {
  id: string;
  user_id: string;
  default_resume_name: string;
  default_job_role: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get user settings. Creates a default row if none exists.
 */
export async function getOrCreateUserSettings(userId: string): Promise<UserSettingsRow> {
  const supabase = getSupabaseClient();

  const { data: existing, error: findError } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (findError && findError.code !== "PGRST116") {
    console.error("Failed to fetch user settings:", findError);
    throw new Error("Failed to load user settings.");
  }

  if (existing) {
    return existing as UserSettingsRow;
  }

  // Create default settings row
  const { data: created, error: createError } = await supabase
    .from("user_settings")
    .insert({
      user_id: userId,
      default_resume_name: "",
      default_job_role: "",
      theme: "system",
    })
    .select()
    .single();

  if (createError) {
    console.error("Failed to create user settings:", createError);
    throw new Error("Failed to initialize user settings.");
  }

  return created as UserSettingsRow;
}

/**
 * Update user settings for a user.
 */
export async function updateUserSettings(
  userId: string,
  data: {
    default_resume_name?: string;
    default_job_role?: string;
    theme?: string;
  }
): Promise<UserSettingsRow> {
  const supabase = getSupabaseClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.default_resume_name !== undefined) updateData.default_resume_name = data.default_resume_name;
  if (data.default_job_role !== undefined) updateData.default_job_role = data.default_job_role;
  if (data.theme !== undefined) updateData.theme = data.theme;

  const { data: updated, error } = await supabase
    .from("user_settings")
    .update(updateData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update user settings:", error);
    throw new Error("Failed to save user settings.");
  }

  return updated as UserSettingsRow;
}

// ─── Mapper ──────────────────────────────────────────────────────

function mapRowToSavedAnalysis(row: Record<string, unknown>): SavedAnalysis {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    resumeName: String(row.resume_name),
    jobTitle: String(row.job_title),
    atsScore: Number(row.ats_score),
    strengths: ensureStringArray(row.strengths),
    weaknesses: ensureStringArray(row.weaknesses),
    missingKeywords: ensureStringArray(row.missing_keywords),
    technicalSkills: ensureStringArray(row.technical_skills),
    softSkills: ensureStringArray(row.soft_skills),
    suggestions: ensureStringArray(row.suggestions),
    interviewReadiness: String(row.interview_readiness),
    createdAt: String(row.created_at),
  };
}

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v));
  }
  return [];
}
