"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import {
  History,
  FileSearch,
  ArrowRight,
  Target,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedAnalysis } from "@/types";

export default function HistoryPage() {
  const [analyses, setAnalyses] = React.useState<SavedAnalysis[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // ─── Fetch analyses ────────────────────────────────────────────
  React.useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/history");
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load history.");
        }

        setAnalyses(json.data as SavedAnalysis[]);
        setTotal(json.total as number);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load history.";
        setError(msg);
        console.error("History load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  // ─── Format date ────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
            Review History
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            View your past resume analyses and comparison results.
          </p>
        </motion.div>

        {/* ─── Loading state ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-20 px-6 shadow-sm">
            <Loader2 className="w-7 h-7 animate-spin text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading your analyses...
            </p>
          </div>
        )}

        {/* ─── Error state ─── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 py-20 px-6 shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <FileSearch className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-base font-medium text-red-800 dark:text-red-200 mb-1">
              Failed to load history
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-sm mb-6">
              {error}
            </p>
            <Button
              variant="outline"
              className="h-10 px-5"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ─── Empty state ─── */}
        {!loading && !error && analyses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-20 px-6 shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <History className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              No review history yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-6">
              Complete your first resume analysis and it will appear here for
              future reference.
            </p>
            <Link href="/dashboard">
              <Button variant="default" size="lg" className="h-10 px-5">
                Analyze Your First Resume
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* ─── Results list ─── */}
        {!loading && !error && analyses.length > 0 && (
          <>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
              {total} {total === 1 ? "review" : "reviews"} total
            </p>

            <div className="space-y-3">
              {analyses.map((analysis, i) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-500/10 shrink-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {analysis.resumeName}
                        </h3>
                      </div>

                      {analysis.jobTitle && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-9 mb-2 truncate">
                          {analysis.jobTitle}
                        </p>
                      )}

                      <div className="flex items-center gap-3 ml-9">
                        <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(analysis.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <Target className="w-3 h-3" />
                          <span
                            className={cn(
                              analysis.atsScore >= 80
                                ? "text-emerald-600 dark:text-emerald-400"
                                : analysis.atsScore >= 60
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400"
                            )}
                          >
                            Score: {analysis.atsScore}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Right: action */}
                    <Link
                      href={`/history/${analysis.id}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
