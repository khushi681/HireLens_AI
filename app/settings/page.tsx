"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useUser } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  Settings2,
  CreditCard,
  BarChart3,
  Info,
  Loader2,
  Check,
  ExternalLink,
  Save,
  Sun,
  Moon,
  Monitor,
  FileText,
  Briefcase,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import type { Subscription, UsageInfo, Theme } from "@/types";

// ─── Sections Skeleton ───────────────────────────────────────────

function SectionSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm animate-pulse">
      <div className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
      <div className="h-3 w-60 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-9 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-9 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <Icon className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ─── Theme Option ────────────────────────────────────────────────

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

// ─── Page ────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, isLoaded: userLoaded } = useUser();

  // States
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Form fields
  const [defaultResumeName, setDefaultResumeName] = React.useState("");
  const [defaultJobRole, setDefaultJobRole] = React.useState("");
  const [theme, setTheme] = React.useState<Theme>("system");

  // Subscription & Usage (reused from /api/subscription)
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [usage, setUsage] = React.useState<UsageInfo | null>(null);

  // ─── Load Settings ───────────────────────────────────────────
  React.useEffect(() => {
    async function loadAll() {
      try {
        const [settingsRes, subRes] = await Promise.all([
          fetch("/api/user-settings"),
          fetch("/api/subscription"),
        ]);

        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          if (settingsJson.success) {
            setDefaultResumeName(settingsJson.data.defaultResumeName || "");
            setDefaultJobRole(settingsJson.data.defaultJobRole || "");
            setTheme(settingsJson.data.theme || "system");
          }
        }

        if (subRes.ok) {
          const subJson = await subRes.json();
          if (subJson.success) {
            setSubscription(subJson.data.subscription);
            setUsage(subJson.data.usage);
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // ─── Save Preferences ────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultResumeName, defaultJobRole, theme }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Preferences saved successfully.");
      } else {
        toast.error(json.error || "Failed to save preferences.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Derived ─────────────────────────────────────────────────
  const isProUser =
    subscription?.plan === "pro" && subscription?.subscriptionStatus === "active";
  const daysLeft = subscription?.currentPeriodEnd
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.currentPeriodEnd).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;
  const remaining =
    usage && usage.plan !== "pro" ? Math.max(0, usage.limit - usage.usedToday) : Infinity;

  // ─── Skeleton Loading ────────────────────────────────────────
  if (loading || !userLoaded) {
    return (
      <AuthLayout>
        <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="animate-pulse mb-8">
            <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <div className="space-y-6">
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8 lg:py-12">
        {/* ─── Page Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account preferences and profile.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* ═══════════════════════════════════════════════════════════
               Section 1: Account
               ═══════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <SectionHeader icon={User} title="Account" description="Your profile information." />

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-zinc-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </p>
                </div>
              </div>

              <a
                href="https://accounts.clerk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex items-center gap-1.5")}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Manage Account
              </a>
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
               Section 2: Preferences
               ═══════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <SectionHeader
                icon={Settings2}
                title="Preferences"
                description="Customise your experience."
              />

              {/* Default Resume Name */}
              <div className="mb-4">
                <label
                  htmlFor="default-resume-name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Default Resume Name
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    id="default-resume-name"
                    type="text"
                    value={defaultResumeName}
                    onChange={(e) => setDefaultResumeName(e.target.value)}
                    placeholder="e.g. My Resume.pdf"
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-shadow"
                  />
                </div>
              </div>

              {/* Default Job Role */}
              <div className="mb-4">
                <label
                  htmlFor="default-job-role"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Default Job Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    id="default-job-role"
                    type="text"
                    value={defaultJobRole}
                    onChange={(e) => setDefaultJobRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-shadow"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Theme
                </label>
                <div className="flex gap-2">
                  {THEME_OPTIONS.map((opt) => {
                    const isActive = theme === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTheme(opt.value)}
                        className={cn(
                          "flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all",
                          isActive
                            ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="gap-1.5"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
               Section 3: Subscription
               ═══════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <SectionHeader
                icon={CreditCard}
                title="Subscription"
                description="Your current plan and billing."
              />

              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
                      isProUser
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    {isProUser ? (
                      <Sparkles className="w-4.5 h-4.5" />
                    ) : (
                      <CreditCard className="w-4.5 h-4.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {isProUser ? "Pro Plan" : "Free Plan"}
                      </span>
                      {subscription && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
                            subscription.subscriptionStatus === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                          )}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {subscription.subscriptionStatus === "active"
                            ? "Active"
                            : subscription.subscriptionStatus === "past_due"
                            ? "Past Due"
                            : subscription.subscriptionStatus === "canceled"
                            ? "Canceled"
                            : "Inactive"}
                        </span>
                      )}
                    </div>
                    {isProUser && daysLeft > 0 && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Renews in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {isProUser ? (
                  <a
                    href="/billing"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex items-center gap-1.5")}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Manage
                  </a>
                ) : (
                  <a
                    href="/billing"
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "inline-flex items-center gap-1.5")}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Upgrade
                  </a>
                )}
              </div>

              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Visit the{" "}
                <a
                  href="/billing"
                  className="text-zinc-600 dark:text-zinc-400 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Billing page
                </a>{" "}
                for full subscription management, including payment methods and invoices.
              </p>
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
               Section 4: Usage
               ═══════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <SectionHeader
                icon={BarChart3}
                title="Usage"
                description="Your daily analysis activity."
              />

              {usage ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {usage.usedToday}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Today&apos;s Analyses
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {usage.plan === "pro" ? (
                        <span className="text-emerald-500">∞</span>
                      ) : (
                        usage.limit
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Daily Limit
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {usage.plan === "pro" ? (
                        <span className="text-emerald-500">∞</span>
                      ) : (
                        remaining
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Remaining
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Unable to load usage data.
                </p>
              )}
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════
               Section 5: About
               ═══════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <SectionHeader
                icon={Info}
                title="About"
                description="Version and legal information."
              />

              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span>Application</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    HireLens AI
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span>Version</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    1.0.0
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span>Build</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    Next.js 16 / React 19
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>API</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    Gemini 2.5 Flash
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-4">
                <a
                  href="#"
                  className="text-xs text-zinc-500 dark:text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-xs text-zinc-500 dark:text-zinc-500 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </AuthLayout>
  );
}
