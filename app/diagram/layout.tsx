// app/layout.tsx
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DiagramProvider } from "@/src/context/DiagramContext";

export const metadata = {
  title: {
    default: "AutoDia AI — AI ERD Generator from Text",
    template: "%s | AutoDia AI",
  },
  description:
    "Turn plain English into professional ER diagrams. Edit on canvas and export to PNG, JSON & SQL.",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "AutoDia AI — AI ERD Generator",
    description:
      "Generate clean ER diagrams from text. Edit and export instantly.",
    url: "https://www.autodia.tech",
    siteName: "AutoDia AI",
    type: "website",
    images: [
      {
        url: "https://www.autodia.tech/og.png",
        width: 1200,
        height: 630,
        alt: "AutoDia AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoDia AI — AI ERD Generator",
    description:
      "Generate clean ER diagrams from text. Edit and export instantly.",
    images: ["https://www.autodia.tech/og.png"],
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <DiagramProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarTrigger />
        <main className="flex w-[95%] mx-auto pr-8 pl-2 py-6">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </SidebarProvider>
    </DiagramProvider>
  );
}
