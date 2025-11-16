import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ClientLayout from "./clientLayout";
export default function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))] relative">
      <ClientLayout>
        <SidebarProvider className="flex flex-col">
          <div className="lg:grid lg:grid-cols-[250px_1fr]">
            <AppSidebar />
            <SidebarInset>
              <div className="p-4 md:p-6 overflow-hidden">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </ClientLayout>
    </div>
  );
}
