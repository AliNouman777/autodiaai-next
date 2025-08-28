// app/about/layout.tsx
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DiagramProvider } from "@/src/context/DiagramContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AutoDia AI — Our Story, Mission & Principles",
  description:
    "Learn about AutoDia AI: why we exist, how we build, and the principles guiding our AI-powered diagramming tools. Transparent roadmap, responsible AI, and accessibility-first.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About AutoDia AI — Our Story, Mission & Principles",
    description:
      "AutoDia AI is an engineering-led effort to make data modeling fast, transparent, and accessible. Learn about our mission, principles, and roadmap.",
    url: "https://www.autodia.tech/about",
    siteName: "AutoDia AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About AutoDia AI — Our Story, Mission & Principles",
    description:
      "How we build AutoDia AI: mission, principles, responsible AI, and roadmap transparency.",
  },
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
  );
}
