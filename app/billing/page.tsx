"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  Zap,
  Check,
  X,
  Loader2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Subscription, UsageInfo } from "@/types";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For casual job seekers.",
    features: [
      "3 resume analyses per day",
      "Resume history",
      "Basic ATS score",
      "Basic suggestions",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious career advancement.",
    features: [
      "Unlimited resume analyses",
      "Advanced AI recommendations",
      "Unlimited history",
      "Priority processing",
      "Future premium features",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function BillingPage() {
  const [loading, setLoading] = React.useState(true);
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [usage, setUsage] = React.useState<UsageInfo | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/subscription");
        const json = await res.json();
        if (json.success) {
          setSubscription(json.data.subscription);
          setUsage(json.data.usage);
        }
      } catch (err) {
        console.error("Failed to load billing:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleUpgrade = async () => {
    setActionLoading("upgrade");
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        toast.error(json.error || "Failed to start checkout.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleManage = async () => {
    setActionLoading("manage");
    try {
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        toast.error(json.error || "Failed to open billing portal.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const isProUser = subscription?.plan === "pro" && subscription?.subscriptionStatus === "active";
  const daysLeft = subscription?.currentPeriodEnd
    ? Math.max(0, Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <AuthLayout>
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-12">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Billing
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your subscription and payment methods.
          </p>
        </motion.div>

        {/* ─── Loading ─── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        )}

        {/* ─── Current Subscription Status ─── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm mb-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                  isProUser
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}>
                  {isProUser ? <Sparkles className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {isProUser ? "Pro Plan" : "Free Plan"}
                    </span>
                    {isProUser && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                  {usage && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {isProUser
                        ? `Your subscription renews in ${daysLeft} days`
                        : `${usage.usedToday} of ${usage.limit} daily analyses used`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isProUser ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManage}
                    disabled={actionLoading === "manage"}
                  >
                    {actionLoading === "manage" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    )}
                    Manage Subscription
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleUpgrade}
                    disabled={actionLoading === "upgrade"}
                  >
                    {actionLoading === "upgrade" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 mr-1" />
                    )}
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Usage Bar ─── */}
        {!loading && usage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Daily Usage
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {usage.plan === "pro" ? "Unlimited" : `${usage.usedToday} / ${usage.limit} analyses`}
              </span>
            </div>
            {usage.plan !== "pro" && (
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((usage.usedToday / usage.limit) * 100, 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full transition-colors",
                    usage.usedToday >= usage.limit
                      ? "bg-red-500"
                      : usage.usedToday >= usage.limit - 1
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  )}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Plan Cards ─── */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map((plan, i) => {
              const isCurrentPlan = isProUser && plan.id === "pro";
              const isFreePlan = !isProUser && plan.id === "free";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className={cn(
                    "relative rounded-xl border p-6 shadow-sm",
                    plan.highlighted
                      ? "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[11px] font-medium">
                      Popular
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                        {plan.price}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {(isCurrentPlan || isFreePlan) ? (
                    <Button
                      variant={plan.highlighted ? "outline" : "secondary"}
                      className="w-full"
                      disabled
                    >
                      Current Plan
                    </Button>
                  ) : plan.id === "pro" ? (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={handleUpgrade}
                      disabled={actionLoading === "upgrade"}
                    >
                      {actionLoading === "upgrade" ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      ) : (
                        <Zap className="w-4 h-4 mr-1.5" />
                      )}
                      Upgrade to Pro
                    </Button>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
