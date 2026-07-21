/**
 * Reusable application constants.
 * For domain-specific constants, see @/constants.
 */

// ─── App Metadata ────────────────────────────────────────────────
export const APP_NAME = "HireSense";
export const APP_DESCRIPTION = "AI-powered resume review platform";

// ─── Routes ──────────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  HISTORY: "/history",
  BILLING: "/billing",
  SETTINGS: "/settings",
} as const;

// ─── API Routes ───────────────────────────────────────────────────
export const API_ROUTES = {
  REVIEWS: "/api/reviews",
  UPLOAD: "/api/upload",
  USER: "/api/user",
  WEBHOOKS: "/api/webhooks",
} as const;

// ─── File Upload ──────────────────────────────────────────────────
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Pagination ───────────────────────────────────────────────────
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

// ─── Validation ───────────────────────────────────────────────────
export const VALIDATION_RULES = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
} as const;

// ─── Auth ─────────────────────────────────────────────────────────
export const AUTH_COOKIE_NAME = "__session";
