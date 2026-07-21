// ─── User & Auth Types ───────────────────────────────────────────
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// ─── Navigation Types ────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavDropdown {
  label: string;
  items: NavLink[];
}

export type NavItem = NavLink | NavDropdown;

// ─── Feature Types ───────────────────────────────────────────────
export interface Feature {
  title: string;
  description: string;
  icon: string;
  color?: string;
}

// ─── Pricing Types ───────────────────────────────────────────────
export type BillingInterval = "monthly" | "yearly";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  highlighted?: boolean;
  cta: string;
}

// ─── Form Types ──────────────────────────────────────────────────
export interface FormState<T = unknown> {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ─── Pagination Types ────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── API Response Types ──────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Theme Types ─────────────────────────────────────────────────
export type Theme = "light" | "dark" | "system";

// ─── Sort & Filter Types ─────────────────────────────────────────
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// ─── Toast/Notification Types ────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

// ─── AI Analysis Types ───────────────────────────────────────────
export interface AnalysisResult {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  technicalSkills: string[];
  softSkills: string[];
  suggestions: string[];
  interviewReadiness: string;
}

// ─── Saved Analysis (from database) ──────────────────────────────
export interface SavedAnalysis extends AnalysisResult {
  id: string;
  userId: string;
  resumeName: string;
  jobTitle: string;
  createdAt: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────
export interface DashboardStats {
  reviewsThisMonth: number;
  averageScore: number;
  totalResumes: number;
}

// ─── File Types ──────────────────────────────────────────────────
export interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

// ─── Review / Resume Review Types (domain-specific) ──────────────
export type ReviewStatus = "pending" | "in_progress" | "completed" | "rejected";

export interface Review {
  id: string;
  title: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Subscription Types ───────────────────────────────────────────
export type Plan = "free" | "pro";
export type SubscriptionStatus = "inactive" | "active" | "past_due" | "canceled" | "trialing";

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Usage / Limits Types ────────────────────────────────────────
export const FREE_DAILY_LIMIT = 3;

export interface UsageInfo {
  usedToday: number;
  limit: number;
  plan: Plan;
}
