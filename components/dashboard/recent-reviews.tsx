"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileSearch, ArrowRight, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentReviewsProps {
  statsLoaded?: boolean;
  totalResumes?: number;
}

export function RecentReviews({ statsLoaded, totalResumes }: RecentReviewsProps) {
  // If stats are loaded and user has analyses, show a "view full history" prompt
  if (statsLoaded && totalResumes && totalResumes > 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
          Recent Reviews
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-16 px-6 shadow-sm"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <History className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
            {totalResumes} review{totalResumes !== 1 ? "s" : ""} completed
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-6">
            View your full review history and revisit past analyses.
          </p>
          <Link href="/history">
            <Button variant="default" size="lg" className="h-10 px-5">
              View Full History
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-12"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Recent Reviews
      </h2>

      {/* Empty state */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-16 px-6 shadow-sm"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <FileSearch className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1">
          No reviews yet
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-6">
          You haven&apos;t analyzed any resumes yet. Upload a resume and job
          description to get started.
        </p>
        <Button
          variant="default"
          size="lg"
          className="h-10 px-5"
          onClick={() => {
            document
              .getElementById("upload-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Analyze Your First Resume
          <ArrowRight className="ml-1.5 w-4 h-4" />
        </Button>
      </motion.div>
    </motion.section>
  );
}
