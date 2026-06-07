"use client";

import {
  UserStar,
  Home,
  MessageSquareQuote,
  LogOut,
  LogIn,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ThemeToggle from "../common/ThemeToggle";

export function AppSidebar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;
    try {
      await logout();
      router.replace("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center  justify-between">
            <div className="flex space-x-2 my-2">
              <Link href="/" className="flex space-x-2 my-2 cursor-pointer">
                <Image
                  src={Logo}
                  alt="Company logo"
                  width={30}
                  height={40}
                  priority
                  className="w-auto h-auto"
                />
                <div className="-ml-2 text-xl font-semibold flex items-center">
                  <span className="text-foreground">Auto</span>
                  <span className="text-primary">Dia</span>&nbsp;
                  <span className="text-foreground">Ai</span>
                </div>
              </Link>
            </div>
            <ThemeToggle />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton
                  asChild
                  className="gap-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Link href="/diagram">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton
                  asChild
                  className="gap-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Link href="/feedback">
                    <MessageSquareQuote className="h-4 w-4" />
                    <span>Feedback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user ? (
                <SidebarMenuItem className="mt-2">
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem className="mt-2">
                  <SidebarMenuButton
                    asChild
                    className="gap-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link href="/login">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
