"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to land your dream job?
          </h2>
          <p className="mt-4 text-base text-zinc-400 max-w-xl mx-auto">
            Join thousands of job seekers who have improved their resumes and gotten more interviews with HireLens AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-11 px-6 bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-11 px-6 bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg"
                >
                  Analyze Your Resume Free
                  <ArrowRight className="ml-1.5 w-4 h-4" />
                </Button>
              </SignUpButton>
            )}
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            No credit card required • Free 3 reviews per month • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
