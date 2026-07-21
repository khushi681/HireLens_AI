"use client";

import * as React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "4.9/5", label: "User Rating" },
  { value: "15min", label: "Avg. Analysis Time" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20 border-y border-zinc-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
