import type React from "react";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientAppShell } from "@/components/layout/client-app-shell";
import { siteConfig } from "@/lib/site.config";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ainure.com"),
  title: `${siteConfig.name} - ${siteConfig.slogan}`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.slogan}`,
    description: siteConfig.description,
    url: "https://ainure.com",
    siteName: siteConfig.name,
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://ainure.com/logo3.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.slogan}`,
    description: siteConfig.description,
    images: ["https://ainure.com/logo3.png"],
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${fraunces.variable} font-sans`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-md bg-ainure-300 px-4 py-2 font-medium text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientAppShell>{children}</ClientAppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
