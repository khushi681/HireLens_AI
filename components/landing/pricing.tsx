"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICING_TIERS } from "@/constants";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function PricingSection() {
  const { isSignedIn } = useUser();

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
            Start for free, upgrade when you need more.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              variants={item}
              className={cn(
                "relative flex flex-col rounded-xl border p-8 transition-all duration-200",
                tier.highlighted
                  ? "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-8 px-3 py-0.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                  {tier.price === 0 ? "Free" : `$${tier.price}`}
                </span>
                {tier.period && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">
                    {tier.period}
                  </span>
                )}
              </div>

              <div className="mb-8 flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300"
                    >
                      <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isSignedIn && tier.id === "starter" ? (
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full h-10">
                    Go to Dashboard
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </Link>
              ) : isSignedIn ? (
                <Link href="/billing">
                  <Button
                    variant={tier.highlighted ? "default" : "outline"}
                    className="w-full h-10"
                  >
                    Upgrade
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <Button
                    variant={tier.highlighted ? "default" : "outline"}
                    className="w-full h-10"
                  >
                    {tier.cta}
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                </SignUpButton>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
