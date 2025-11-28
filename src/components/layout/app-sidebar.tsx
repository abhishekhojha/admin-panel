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
  Tag,
  List,
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
import { useAppSelector } from "@/store";
import { useDispatch } from "react-redux";
import { getProfile } from "@/store/auth/authThunks";
import { AppDispatch } from "@/store/store";
const data = {
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
          permission: "MANAGE_PRODUCTS",
        },
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
          permission: "MANAGE_ORDERS",
        },
        {
          title: "Categories",
          url: "/categories",
          icon: Layers,
          permission: "MANAGE_CATEGORIES",
        },
        {
          title: "Coupons",
          url: "/coupons",
          icon: Tag,
          permission: "MANAGE_COUPONS",
        },
        {
          title: "Sections",
          url: "/sections",
          icon: List,
          permission: "MANAGE_SECTIONS",
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
          permission: "MANAGE_USERS",
        },
        {
          title: "Roles",
          url: "/roles",
          icon: Shield,
          permission: "MANAGE_ROLES",
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
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const permissions = user?.role?.permissions || [];

  const filteredNavMain = data.navMain
    .map((section) => {
      const filteredItems = section.items.filter((item: any) => {
        if (!item.permission) return true;
        if (permissions.includes("*")) return true;
        return permissions.includes(item.permission);
      });

      // If section has items but all are filtered out, hide section?
      // Or if section has no items originally (like Dashboard), keep it.
      // For now, keeping section if it has items OR if it originally had no items (like Dashboard)
      // But if it had items and they are all filtered, maybe hide it?
      // Let's keep it simple: just filter items.

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => {
      // Optional: Hide section if it has no items left, but only if it originally had items
      // Dashboard has 0 items originally, so we keep it.
      // E-commerce has items, if all filtered, we might want to hide it.
      // For now, let's just return true to show empty sections or refine logic if needed.
      if (
        section.items.length === 0 &&
        data.navMain.find((s) => s.title === section.title)?.items.length! > 0
      ) {
        return false;
      }
      return true;
    });

  return (
    <Sidebar
      className="top-0 h-[100svh]! bg-sidebar-background"
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
        <NavMain items={filteredNavMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
