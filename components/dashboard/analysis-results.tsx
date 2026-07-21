"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Target,
  ThumbsUp,
  AlertTriangle,
  Search,
  Wrench,
  Users,
  Lightbulb,
  UserCheck,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/types";

interface AnalysisResultsProps {
  result: AnalysisResult;
  analysisId?: string | null;
  onReset: () => void;
}

function ScoreRing({ score }: { score: number }) {
  // Determine color based on score
  const color =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
      ? "text-amber-500"
      : "text-red-500";

  const bgColor =
    score >= 80
      ? "text-emerald-200 dark:text-emerald-800"
      : score >= 60
      ? "text-amber-200 dark:text-amber-800"
      : "text-red-200 dark:text-red-800";

  const label =
    score >= 80 ? "Strong Match" : score >= 60 ? "Moderate Match" : "Weak Match";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className={bgColor}
          />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100),
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={color}
          />
        </svg>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={cn("text-3xl font-bold", color)}
        >
          {score}
        </motion.span>
      </div>
      <span className={cn("mt-1 text-xs font-medium", color)}>{label}</span>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  items,
  color = "blue",
  emptyMessage,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  color?: "blue" | "emerald" | "amber" | "red" | "purple" | "zinc";
  emptyMessage?: string;
}) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    zinc: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400"
            >
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-300 dark:bg-zinc-600" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
          {emptyMessage || "None identified"}
        </p>
      )}
    </motion.div>
  );
}

export function AnalysisResults({ result, analysisId, onReset }: AnalysisResultsProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Analysis Results
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          New Analysis
        </Button>
      </div>

      {/* Score + Interview Readiness */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="col-span-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm flex flex-col items-center justify-center"
        >
          <ScoreRing score={result.atsScore} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Interview Readiness
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {result.interviewReadiness}
          </p>
        </motion.div>
      </div>

      {/* Two-column grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <SectionCard
          icon={ThumbsUp}
          title="Strengths"
          items={result.strengths}
          color="emerald"
        />
        <SectionCard
          icon={AlertTriangle}
          title="Weaknesses"
          items={result.weaknesses}
          color="red"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <SectionCard
          icon={Search}
          title="Missing Keywords"
          items={result.missingKeywords}
          color="amber"
          emptyMessage="All key terms are covered!"
        />
        <SectionCard
          icon={Wrench}
          title="Technical Skills"
          items={result.technicalSkills}
          color="blue"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard
          icon={Users}
          title="Soft Skills"
          items={result.softSkills}
          color="purple"
        />
        <SectionCard
          icon={Lightbulb}
          title="Suggestions"
          items={result.suggestions}
          color="zinc"
        />
      </div>
    </motion.section>
  );
}
