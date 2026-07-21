"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
          <XCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          No charges were made. Your current plan remains active. You can try upgrading again whenever you&apos;re ready.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/billing">
            <Button variant="outline" size="lg" className="h-11 px-6">
              <RotateCcw className="mr-1.5 w-4 h-4" />
              Try Again
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="default" size="lg" className="h-11 px-6">
              Go to Dashboard
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
