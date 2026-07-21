// ─── App Info ────────────────────────────────────────────────────
export const APP_NAME = "HireLens AI";
export const APP_TAGLINE = "Resume Reviews Powered by AI";
export const APP_DESCRIPTION =
  "Get instant, actionable feedback on your resume. HireLens AI analyzes your resume against industry standards and delivers personalized improvement suggestions.";

// ─── Navigation ──────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

// ─── Auth Routes ─────────────────────────────────────────────────
export const AUTH_ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  callback: "/auth/callback",
} as const;

// ─── Protected Routes ────────────────────────────────────────────
export const PROTECTED_ROUTES = {
  dashboard: "/dashboard",
  settings: "/settings",
  history: "/history",
  billing: "/billing",
} as const;

// ─── Public Routes ───────────────────────────────────────────────
export const PUBLIC_ROUTES = ["/", "/pricing"] as const;

// ─── Theme ───────────────────────────────────────────────────────
export const THEME_STORAGE_KEY = "hirelens-theme";

// ─── Pricing ─────────────────────────────────────────────────────
export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individual job seekers.",
    price: 0,
    period: "free",
    features: [
      "3 resume reviews per month",
      "Basic AI analysis",
      "Score & suggestions",
      "PDF export",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious career advancement.",
    price: 19,
    period: "/month",
    features: [
      "Unlimited resume reviews",
      "Advanced AI analysis",
      "ATS compatibility scoring",
      "Tailored cover letter drafts",
      "Priority support",
      "Export to all formats",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
] as const;

// ─── Validation ──────────────────────────────────────────────────
export const VALIDATION = {
  nameMinLength: 2,
  nameMaxLength: 100,
  passwordMinLength: 8,
  passwordMaxLength: 128,
} as const;

// ─── Routes Map ──────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  ...AUTH_ROUTES,
  ...PROTECTED_ROUTES,
} as const;

// ─── SEO ─────────────────────────────────────────────────────────
export const SEO = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  siteName: APP_NAME,
  locale: "en_US",
  type: "website" as const,
};
