export { getSupabaseClient } from "./client";
export {
  saveAnalysis,
  getUserAnalyses,
  getUserAnalysisById,
  getUserStats,
  getMonthlyAnalysisCount,
  getDailyAnalysisCount,
  extractJobTitle,
  getOrCreateSubscription,
  getSubscriptionByCustomerId,
  getSubscriptionByStripeId,
  upsertSubscriptionByUser,
  updateSubscriptionByStripeId,
  checkAnalysisLimit,
  getOrCreateUserSettings,
  updateUserSettings,
} from "./service";
export type { SavedAnalysis, DashboardStats, SubscriptionRow, UserSettingsRow } from "./service";
