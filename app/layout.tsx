// app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import "@/src/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import JsonLd from "@/components/seo/JsonLd";

const AHREFS_KEY = "Omxnkw4vK8vRC7JSC8/Wlw";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autodia.tech"),
  applicationName: "AutoDia AI",
  title: {
    default: "AutoDia AI — AI ERD Generator & Database Schema Designer",
    template: "%s | AutoDia AI",
  },
  description:
    "AutoDia AI generates ER diagrams from plain text. Edit on an interactive canvas, refine your schema, and export PNG to accelerate database design.",
  keywords: [
    "AI ERD generator",
    "ER diagram",
    "entity relationship diagram",
    "database schema design",
    "schema designer",
    "diagram editor",
    "ERD online",
    "generate ERD from text",
    "Autodia",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://www.autodia.tech",
    siteName: "AutoDia AI",
    title: "AutoDia AI — AI ERD Generator & Database Schema Designer",
    description:
      "Generate ER diagrams from text, edit on an interactive canvas, and export PNG.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AutoDia AI" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YourHandle",
    creator: "@YourHandle",
    title: "AutoDia AI — AI ERD Generator & Database Schema Designer",
    description:
      "Generate ER diagrams from text, edit on an interactive canvas, and export PNG.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b63ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD (sitewide) */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: "https://www.autodia.tech/",
            name: "AutoDia AI",
            alternateName: "AutoDia",
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <Script
          id="ahrefs-analytics"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key={AHREFS_KEY}
          strategy="beforeInteractive"
        />

        <ThemeProvider>
          <AuthProvider>
            <main className="mx-auto">{children}</main>
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "border border-slate-200 dark:border-slate-800 bg-white text-slate-900 dark:bg-slate-900 dark:text-white",
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
