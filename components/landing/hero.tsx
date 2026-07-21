"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, FileText, Sparkles, BarChart3, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] as const },
});

export function HeroSection() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      {/* Soft ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 lg:px-8 lg:pt-40 lg:pb-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─── Left: Content ─── */}
          <div className="max-w-xl">
            <motion.div {...fadeUp(0.1)}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                AI-Powered Resume Analysis
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 leading-[1.1]"
            >
              Land your dream job
              <br />
              <span className="text-zinc-500 dark:text-zinc-400">with a resume that stands out.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.3)}
              className="mt-6 text-base leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-md"
            >
              Upload your resume and get instant AI-powered feedback. We analyze content, formatting, and ATS compatibility to help you get more interviews.
            </motion.p>

            <motion.div
              {...fadeUp(0.4)}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              {!isLoaded ? (
                <div className="w-40 h-11 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ) : isSignedIn ? (
                <Link href="/dashboard">
                  <Button variant="default" size="lg" className="h-11 px-6">
                    Go to Dashboard
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <Button variant="default" size="lg" className="h-11 px-6 shadow-sm">
                    Analyze Your Resume Free
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </SignUpButton>
              )}
              <Link href="#how-it-works">
                <Button variant="ghost" size="lg" className="h-11 px-6">
                  See how it works
                </Button>
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp(0.5)}
              className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-500"
            >
              {["No credit card", "Free tier included", "2-min setup"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ─── Right: Dashboard Mockup ─── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] as const }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-black/20 overflow-hidden">
              {/* Mockup header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="ml-3 flex-1 max-w-[160px] h-5 rounded-md bg-zinc-100 dark:bg-zinc-800" />
              </div>

              {/* Mockup body */}
              <div className="p-4 space-y-4">
                {/* Score card */}
                <div className="flex gap-4">
                  <div className="flex-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-500">Overall Score</span>
                      <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">86</span>
                      <span className="text-sm text-zinc-400 mb-0.5">/100</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "86%" }}
                        transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <span className="text-xs font-medium text-zinc-500">ATS Score</span>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">72</p>
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "72%" }}
                        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Top Suggestions</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Add quantifiable achievements",
                      "Optimize for ATS keywords",
                      "Strengthen summary section",
                    ].map((text, i) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 1.5 + i * 0.15 }}
                        className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {text}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-500">resume_2024.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Improve
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center"
            >
              <FileText className="w-6 h-6 text-blue-500" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-14 h-14 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center"
            >
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
