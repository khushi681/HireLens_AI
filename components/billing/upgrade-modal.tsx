"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const features = [
    "Unlimited resume analyses",
    "Advanced AI recommendations",
    "Priority processing",
    "Unlimited history",
    "Future premium features",
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Upgrade to Pro
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              You&apos;ve reached your daily limit. Upgrade for unlimited analyses and advanced features.
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-6">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                  <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">$19</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                size="lg"
                className="w-full h-11"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <Zap className="w-4 h-4 mr-1.5" />
                )}
                Upgrade to Pro
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-11 text-sm text-zinc-500"
                onClick={onClose}
              >
                Maybe later
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
