"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Building2,
  Command,
  LifeBuoy,
  Send,
  Settings2,
  ShoppingBag,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Layers,
  Shield,
  CreditCard,
  FileText,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavProjects } from "@/components/layout/nav-projects";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [], // No sub-items for Dashboard
    },
    {
      title: "E-commerce",
      url: "#",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/products",
          icon: Package,
        },
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
        },
        {
          title: "Categories",
          url: "/categories",
          icon: Layers,
        },
      ],
    },
    {
      title: "Administration",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
        {
          title: "Roles",
          url: "/roles",
          icon: Shield,
        },
      ],
    },
    {
      title: "Loan Management",
      url: "#",
      icon: CreditCard,
      isActive: false,
      items: [
        {
          title: "Applications",
          url: "#", // Placeholder
          icon: FileText,
        },
        {
          title: "Approvals",
          url: "#", // Placeholder
          icon: FileText,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-0 h-[100svh]! border-r bg-sidebar-background"
      variant="inset"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-foreground">
                    Admin Panel
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
