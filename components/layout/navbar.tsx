"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, APP_NAME } from "@/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { isSignedIn, isLoaded } = useUser();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 dark:bg-zinc-950/80 dark:border-zinc-800/50"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold transition-transform group-hover:scale-105">
            H
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {APP_NAME}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLoaded ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-24 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 rounded-md ring-1 ring-zinc-200 dark:ring-zinc-700",
                  },
                }}
              />
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" size="sm">Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-50 p-2 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-zinc-200 dark:bg-zinc-950/95 dark:border-zinc-800"
          >
            <div className="px-6 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                {!isLoaded ? (
                  <div className="flex flex-col gap-3">
                    <div className="w-full h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="w-full h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  </div>
                ) : isSignedIn ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" size="lg" className="w-full">Dashboard</Button>
                    </Link>
                    <div className="flex justify-center"><UserButton /></div>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="lg" className="w-full">Sign in</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button variant="default" size="lg" className="w-full">Get Started Free</Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
