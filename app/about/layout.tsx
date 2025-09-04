// app/about/layout.tsx
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DiagramProvider } from "@/src/context/DiagramContext";
import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autodia.tech"),
  applicationName: "AutoDia AI",
  title: "About AutoDia AI — Our Story, Mission & Principles",
  description:
    "Learn about AutoDia AI: why we exist, how we build, and the principles guiding our AI-powered diagramming tools. Transparent roadmap, responsible AI, and accessibility-first.",
  keywords: [
    "About AutoDia AI",
    "AI ERD Generator",
    "entity relationship diagram",
    "database schema design",
    "responsible AI",
    "data modeling mission",
    "diagramming principles",
  ],
  alternates: { canonical: "/about" },
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
    title: "About AutoDia AI — Our Story, Mission & Principles",
    description:
      "AutoDia AI is an engineering-led effort to make data modeling fast, transparent, and accessible. Learn about our mission, principles, and roadmap.",
    url: "https://www.autodia.tech/about",
    siteName: "AutoDia AI",
    type: "website",
    images: [
      {
        url: "/og.png", // make sure this exists in /public
        width: 1200,
        height: 630,
        alt: "About AutoDia AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About AutoDia AI — Our Story, Mission & Principles",
    description:
      "How we build AutoDia AI: mission, principles, responsible AI, and roadmap transparency.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b63ff",
};

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // fix: cookies() is synchronous in App Router
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en">
      <head>
        {/* ✅ JSON-LD: WebPage schema */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: "https://www.autodia.tech/about",
            name: "About AutoDia AI — Our Story, Mission & Principles",
            description:
              "Learn about AutoDia AI: mission, principles, responsible AI, and our transparent roadmap.",
          }}
        />

        {/* ✅ JSON-LD: Breadcrumb schema */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.autodia.tech/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://www.autodia.tech/about",
              },
            ],
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <DiagramProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <div className="w-full">
              <div className="sticky top-1 z-20">
                <SidebarTrigger />
              </div>
              <main className="mx-auto w-[95%] px-2 py-6 pr-8">{children}</main>
            </div>
          </SidebarProvider>
        </DiagramProvider>
      </body>
    </html>
  );
}
