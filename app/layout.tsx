// app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import "@/src/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "react-hot-toast";

// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://www.autodia.tech"),
  applicationName: "AutoDia AI",
  title: {
    default: "AutoDia AI — AI ERD Generator & Database Schema Designer",
    template: "%s | AutoDia AI",
  },
  description:
    "Create entity-relationship diagrams from plain text. Edit on an interactive canvas and export PNG to speed up database schema design.",
  keywords: [
    "AI ERD generator",
    "ER diagram",
    "entity relationship diagram",
    "database schema design",
    "schema designer",
    "diagram editor",
    "ERD online",
    "generate ERD from text",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.autodia.tech",
    siteName: "AutoDia AI",
    title: "AutoDia AI — AI ERD Generator & Database Schema Designer",
    description:
      "Generate ER diagrams from text, edit on an interactive canvas, and export PNG.",
    images: [
      {
        // you currently have og.png.png in /public
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AutoDia AI — ERD Generator",
      },
    ],
  },

  // ROOT-LEVEL ICONS (make sure these files exist in /public)
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" }, // important for Google SERP
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }, // fallback
      // optional: if you keep a generic /favicon.png at root
      { url: "/favicon.png", sizes: "any", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },

  // put this file at /public/site.webmanifest (update its icon src to absolute paths)
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b63ff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <ThemeProvider>
          <AuthProvider>
            <main>
              <div className="mx-auto">{children}</div>
            </main>

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
