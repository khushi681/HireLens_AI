/**
 * Feature flags configuration.
 * Toggle features on/off based on environment or deployment stage.
 */

// Environment flag helpers
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

export const features = {
  /** Enable AI-powered resume analysis */
  aiAnalysis: true,

  /** Enable team collaboration features */
  collaboration: isDev,

  /** Enable API access for external integrations */
  apiAccess: isProd,

  /** Enable custom branding for enterprise */
  customBranding: isProd,

  /** Enable the onboarding wizard */
  onboarding: true,

  /** Enable analytics dashboard */
  analytics: isProd,

  /** Debug mode (dev only) */
  debug: isDev,
} as const;

export type FeatureFlag = keyof typeof features;
