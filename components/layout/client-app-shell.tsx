"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const isProduction = process.env.NODE_ENV === "production";

function AppShellContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/**
 * Wraps Header, main content and Footer. In production renders normally (SSR + hydrate).
 * In development, defers mounting the shell until after client mount to avoid hydration
 * mismatch when the environment (e.g. Cursor preview) injects data-cursor-ref into the DOM.
 */
export function ClientAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isProduction) {
    return <AppShellContent>{children}</AppShellContent>;
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 shrink-0" aria-hidden />
        <main id="main-content" className="flex-1" aria-hidden>
          <div className="app-container app-page-header py-12">
            <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
            <div className="mt-2 h-4 w-3/4 max-w-xl animate-pulse rounded bg-white/5" />
          </div>
        </main>
        <footer className="h-48 shrink-0" aria-hidden />
      </div>
    );
  }

  return <AppShellContent>{children}</AppShellContent>;
}
