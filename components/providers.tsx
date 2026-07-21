"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "@/providers/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/80",
          footerActionLink: "text-primary hover:text-primary/80",
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="hire-sense-theme"
      >
        {children}
        <Toaster richColors closeButton position="bottom-right" />
      </ThemeProvider>
    </ClerkProvider>
  );
}
