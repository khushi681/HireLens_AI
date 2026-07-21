"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, FileText, ArrowUpRight } from "lucide-react";

const bars = [45, 72, 88, 55, 90, 65, 78];

export function PreviewSection() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            See your improvement in real time
          </h2>
          <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
            Track your resume scores across multiple dimensions and watch them improve with each revision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="w-full max-w-4xl mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-black/20 overflow-hidden">
            {/* Preview header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold">
                  H
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">HireLens AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  Score: 86/100
                </div>
              </div>
            </div>

            {/* Preview body */}
            <div className="p-6 sm:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Score breakdown */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    Section Scores
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Content", score: 88, color: "bg-blue-500" },
                      { label: "Formatting", score: 92, color: "bg-emerald-500" },
                      { label: "Keywords", score: 75, color: "bg-amber-500" },
                      { label: "Experience", score: 82, color: "bg-violet-500" },
                      { label: "Education", score: 90, color: "bg-cyan-500" },
                    ].map((section) => (
                      <div key={section.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            {section.label}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {section.score}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${section.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className={`h-full rounded-full ${section.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Chart area */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    Improvement Over Time
                  </h3>
                  <div className="h-48 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-4 flex items-end gap-2">
                    {bars.map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500"
                        style={{ minHeight: 0 }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                    <span>Week 1</span>
                    <span>Week 4</span>
                    <span>Week 8</span>
                  </div>
                </div>
              </div>

              {/* Bottom insight */}
              <div className="mt-6 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      +24% improvement since last review
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Your keyword optimization score has significantly improved. Keep up the great work!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
