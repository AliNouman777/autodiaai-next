// app/layout.tsx
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DiagramProvider } from "@/src/context/DiagramContext";

export const metadata = {
  title: "Autodia AI — Free AI ERD Generator | Create Database Diagrams from Text",
  description:
    "Generate professional Entity Relationship Diagrams (ERDs) from plain English using Autodia AI. No login required—start free, edit, and export clean database diagrams instantly.",
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
