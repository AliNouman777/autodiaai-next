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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/diagram",
    icon: Home,
  },
  // {
  //   title: "MemberShip",
  //   url: "#",
  //   icon: UserStar,
  // },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageSquareQuote,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex space-x-2 my-2 ">
              <Link href={"/"} className="flex space-x-2 my-2  cursor-pointer ">
                <Image
                  src={Logo}
                  alt="Company logo"
                  width={60}
                  height={48}
                  priority
                  className="w-auto h-auto"
                />
                <div className="-ml-5 text-xl font-semibold flex items-center ">
                  <span className="text-gray-700">Auto</span>
                  <span className="text-blue-500">Dia</span>
                  &nbsp;
                  <span className="text-gray-700"> Ai</span>
                </div>
              </Link>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-2">
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
