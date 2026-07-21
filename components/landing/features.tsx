"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  FileCheck,
  BarChart3,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced language models analyze your resume against role-specific criteria and industry benchmarks.",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    icon: Target,
    title: "ATS Compatibility",
    description:
      "Ensure your resume passes Applicant Tracking Systems with keyword optimization and formatting checks.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    icon: FileCheck,
    title: "Actionable Suggestions",
    description:
      "Get specific, prioritized recommendations for every section — from summary to work experience.",
    color: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    icon: BarChart3,
    title: "Detailed Scoring",
    description:
      "Understand your resume's strengths and weaknesses with section-by-section scoring and benchmarks.",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    icon: Sparkles,
    title: "Cover Letter Drafts",
    description:
      "Generate tailored cover letters that complement your resume and target specific job descriptions.",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "Your data is encrypted at rest and in transit. We never share your resume with third parties.",
    color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Everything you need to perfect your resume
          </h2>
          <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
            Intelligent analysis, actionable feedback, and tools to help you stand out from the competition.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all duration-200 hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
