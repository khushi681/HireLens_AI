/**
 * History Detail Page — displays a previously saved analysis.
 * Loads from the database (no Gemini call) and renders with AnalysisResults.
 */

"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { AnalysisResults } from "@/components/dashboard/analysis-results";
import { ArrowLeft, Loader2, FileSearch, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedAnalysis, AnalysisResult } from "@/types";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [analysis, setAnalysis] = React.useState<SavedAnalysis | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // ─── Fetch analysis from DB ────────────────────────────────────
  React.useEffect(() => {
    if (!id) return;

    async function loadAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/history/${id}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Analysis not found.");
        }

        setAnalysis(json.data as SavedAnalysis);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to load analysis.";
        setError(msg);
        console.error("Analysis load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [id]);

  // ─── Format date ────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AuthLayout>
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-12">
        {/* ─── Back navigation ─── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Link>
        </motion.div>

        {/* ─── Loading state ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-20 px-6 shadow-sm">
            <Loader2 className="w-7 h-7 animate-spin text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading analysis...
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
              {error === "Analysis not found."
                ? "Analysis not found"
                : "Failed to load analysis"}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-sm mb-6">
              {error === "Analysis not found."
                ? "This analysis may have been deleted or you may not have access to it."
                : error}
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-10 px-5"
                onClick={() => router.push("/history")}
              >
                Back to History
              </Button>
              {error !== "Analysis not found." && (
                <Button
                  variant="default"
                  className="h-10 px-5"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ─── Analysis content ─── */}
        {!loading && !error && analysis && (
          <>
            {/* Metadata header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm mb-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 shrink-0">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {analysis.resumeName}
                  </h1>
                  {analysis.jobTitle && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {analysis.jobTitle}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(analysis.createdAt)}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        analysis.atsScore >= 80
                          ? "text-emerald-600 dark:text-emerald-400"
                          : analysis.atsScore >= 60
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      Score: {analysis.atsScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reuse the existing AnalysisResults component */}
            <AnalysisResults
              result={analysis as unknown as AnalysisResult}
              analysisId={analysis.id}
              onReset={() => router.push("/dashboard")}
            />
          </>
        )}
      </div>
    </AuthLayout>
  );
}
