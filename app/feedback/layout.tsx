import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { FeedbackProvider } from "@/src/context/FeedbackContext";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <FeedbackProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarTrigger />
        <main className="flex w-[95%] mx-auto  pr-8 pl-2 py-6">{children}</main>
      </SidebarProvider>
    </FeedbackProvider>
  );
}
