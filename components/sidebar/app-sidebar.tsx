"use client";
import { UserStar, Home, MessageSquareQuote, LogOut } from "lucide-react";
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
import { useAuth } from "@/src/context/AuthContext"; // ✅ Import your AuthContext
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function AppSidebar() {
  const { logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;
    try {
      await logout(); // Calls API + clears auth state
      router.replace("/login"); // Redirect to login
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed. Try again.");
    }
  };

  const menuItems = [
    {
      title: "Home",
      url: "/diagram",
      icon: Home,
      onClick: undefined,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: MessageSquareQuote,
      onClick: undefined,
    },
    {
      title: "Logout",
      url: "#",
      icon: LogOut,
      onClick: handleLogout, // ✅ Trigger logout
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex space-x-2 my-2">
              <Link href="/" className="flex space-x-2 my-2 cursor-pointer">
                <Image
                  src={Logo}
                  alt="Company logo"
                  width={60}
                  height={48}
                  priority
                  className="w-auto h-auto"
                />
                <div className="-ml-5 text-xl font-semibold flex items-center">
                  <span className="text-gray-700">Auto</span>
                  <span className="text-blue-500">Dia</span>
                  &nbsp;
                  <span className="text-blue-500"> Ai</span>
                </div>
              </Link>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-2">
                  <SidebarMenuButton
                    asChild={!item.onClick}
                    onClick={item.onClick}
                    className="cursor-pointer"
                  >
                    {item.onClick ? (
                      <div className="flex items-center space-x-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
