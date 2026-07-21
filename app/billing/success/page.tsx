"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/billing");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="text-2xl font-semibold">
          Payment Successful!
        </h1>

        <p className="text-sm text-zinc-500 mb-2">
          Thank you for upgrading to HireLens AI Pro.
        </p>

        {sessionId && (
          <p className="text-xs text-zinc-400 mb-8">
            Session: {sessionId.slice(0, 15)}...
          </p>
        )}

        <Link href="/dashboard">
          <Button size="lg">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <p className="text-xs text-zinc-400 mt-4">
          Redirecting to billing in 5 seconds...
        </p>
      </motion.div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <BillingSuccessContent />
    </Suspense>
  );
}