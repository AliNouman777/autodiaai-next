// app/layout.tsx
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DiagramProvider } from "@/src/context/DiagramContext";

export const metadata = {
  title: {
    default: "AutoDia AI — Free AI ERD Generator from Text",
    template: "%s | AutoDia AI",
  },
  description:
    "Turn plain English into professional ER diagrams. Start free—no login required. Edit on canvas and export PNG, JSON & SQL. Fast, accurate, and editable.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AI ERD generator",
    "ER diagram generator",
    "generate ERD from text",
    "online ERD Generator",
    "database diagram tool",
    "export ERD to SQL,PNG,JSON",
  ],
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
          {/* Vercel Analytics & Speed Insights */}
          <Analytics />
          <SpeedInsights />
        </main>
      </SidebarProvider>
    </DiagramProvider>
  );
}
