// app/diagram/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DiagramProvider } from "@/src/context/DiagramContext";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Diagram Editor — AutoDia AI",
  description:
    "Edit, refine, and export professional ER diagrams directly in your browser with AutoDia AI.",
  alternates: { canonical: "https://www.autodia.tech/diagram" },
};

export default async function DiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <section className="min-h-screen flex">
      {/* JSON-LD specific to diagram page */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Diagram Editor",
          url: "https://www.autodia.tech/diagram",
        }}
      />

      <DiagramProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarTrigger />
          <main className="flex-1 w-[95%] mx-auto pr-8 pl-2 py-6">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
        </SidebarProvider>
      </DiagramProvider>
    </section>
  );
}
