"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Upload, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ResumeUploadCard } from "@/components/dashboard/resume-upload";
import { JobDescriptionCard } from "@/components/dashboard/job-description";
import { RecentReviews } from "@/components/dashboard/recent-reviews";
import { AnalysisResults } from "@/components/dashboard/analysis-results";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import type { AnalysisResult, DashboardStats, Plan } from "@/types";

export default function DashboardPage() {
  const { user } = useUser();
  const [resume, setResume] = React.useState<File | null>(null);
  const [jobDescription, setJobDescription] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DashboardStats>({
    reviewsThisMonth: 0,
    averageScore: 0,
    totalResumes: 0,
  });
  const [statsLoaded, setStatsLoaded] = React.useState(false);
  const [limitReached, setLimitReached] = React.useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [dailyUsage, setDailyUsage] = React.useState<{ usedToday: number; limit: number; plan: Plan } | null>(null);

  const isReady = resume !== null && jobDescription.trim().length > 0;

  // ─── Fetch stats and subscription on mount ─────────────────────
  React.useEffect(() => {
    async function loadInitialData() {
      try {
        const [statsRes, subRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/subscription"),
        ]);
        const statsJson = await statsRes.json();
        if (statsJson.success && statsJson.data) {
          setStats(statsJson.data);
        }
        const subJson = await subRes.json();
        if (subJson.success && subJson.data) {
          setDailyUsage(subJson.data.usage);
        }
      } catch {
        // Silently fail
      } finally {
        setStatsLoaded(true);
      }
    }
    loadInitialData();
  }, []);

  // ─── Refresh stats after analysis ──────────────────────────────
  const refreshStats = React.useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      }
    } catch {
      // Silently fail
    }
  }, []);

  const handleAnalyze = async () => {
    if (!isReady) return;

    setIsAnalyzing(true);
    setResult(null);
    setAnalysisId(null);

    try {
      const formData = new FormData();
      formData.append("resume", resume!);
      formData.append("jobDescription", jobDescription.trim());

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        // Check if it's a limit error
        if (json.limitReached) {
          setLimitReached(true);
          setShowUpgradeModal(true);
          return;
        }
        throw new Error(json.error || "Analysis failed. Please try again.");
      }

      setResult(json.data as AnalysisResult);
      setAnalysisId(json.analysisId as string | null);

      if (json.saveWarning) {
        toast.warning(json.saveWarning);
      } else {
        toast.success("Analysis complete! Saved to your history.");
      }

      // Refresh stats to reflect the new analysis
      refreshStats();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAnalysisId(null);
    setResume(null);
    setJobDescription("");
    setLimitReached(false);
  };

  const firstName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  return (
    <AuthLayout>
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-12">
        {/* ─── Welcome Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-lg">
            Upload your resume and compare it with a job description to receive
            AI-powered feedback.
          </p>
        </motion.div>

        {/* ─── Quick Stats Row ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {([
            {
              label: "Reviews This Month",
              value: statsLoaded ? String(stats.reviewsThisMonth) : "—",
              icon: BarChart3,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Avg. Score",
              value: statsLoaded
                ? stats.averageScore > 0
                  ? `${stats.averageScore}`
                  : "—"
                : "—",
              icon: Sparkles,
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Resumes Uploaded",
              value: statsLoaded ? String(stats.totalResumes) : "—",
              icon: Upload,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ] as const).map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-md",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", stat.color)} />
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </span>
                </div>
                <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* ─── Upload + Job Description Cards ─── */}
        <div id="upload-section" className="grid md:grid-cols-2 gap-6">
          <ResumeUploadCard onFileSelect={setResume} />
          <JobDescriptionCard
            value={jobDescription}
            onChange={setJobDescription}
          />
        </div>

        {/* ─── Analyze Button ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mt-8"
        >
          <Button
            variant="default"
            size="lg"
            disabled={!isReady || isAnalyzing}
            onClick={handleAnalyze}
            className={cn(
              "h-11 px-8 text-sm font-medium shadow-sm transition-all",
              isReady && !isAnalyzing && "hover:shadow-md"
            )}
          >
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Resume
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </>
            )}
          </Button>
        </motion.div>

        {/* ─── Analysis Results ─── */}
        {result && (
          <AnalysisResults
            result={result}
            analysisId={analysisId}
            onReset={handleReset}
          />
        )}

        {/* ─── Recent Reviews ─── */}
        {!result && <RecentReviews statsLoaded={statsLoaded} totalResumes={stats.totalResumes} />}

        {/* ─── Upgrade Modal ─── */}
        <UpgradeModal
          open={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </AuthLayout>
  );
}
