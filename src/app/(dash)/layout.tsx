import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import ClientLayout from "./clientLayout";

export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))] relative">
      <ClientLayout>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <div className="flex-1 w-full p-4 md:p-6 overflow-x-hidden">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ClientLayout>
    </div>
  );
}
