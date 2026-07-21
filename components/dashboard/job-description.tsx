"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDescriptionCardProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_CHARS = 5000;

export function JobDescriptionCard({ value, onChange }: JobDescriptionCardProps) {
  const charCount = value.length;
  const isNearLimit = charCount > MAX_CHARS * 0.9;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Briefcase className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Job Description
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Paste the full job posting for accurate matching
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Paste the complete job description here..."
          rows={10}
          className={cn(
            "w-full resize-none rounded-lg border px-3.5 py-3 text-sm transition-colors",
            "bg-white dark:bg-zinc-900",
            "text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
            "focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400/20 dark:focus:ring-zinc-500/20",
            isOverLimit && "border-red-400 dark:border-red-500 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400/20"
          )}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        {isOverLimit ? (
          <span className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="w-3 h-3" />
            Character limit exceeded
          </span>
        ) : (
          <span className="text-xs text-zinc-400" />
        )}
        <span
          className={cn(
            "text-xs tabular-nums",
            isOverLimit
              ? "text-red-500 font-medium"
              : isNearLimit
              ? "text-amber-500"
              : "text-zinc-400"
          )}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}
