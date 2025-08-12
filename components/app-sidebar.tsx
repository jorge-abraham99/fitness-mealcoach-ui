import { Sidebar, SidebarHeader, SidebarContent, SidebarRail, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Dumbbell, LayoutGrid } from 'lucide-react'

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <a href="#">
                <Dumbbell />
                <span>Fitness Coach</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Overview">
              <a href="#">
                <LayoutGrid />
                <span>Overview</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Intentionally minimal: meal plan table and chat have moved to main/right areas */}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
