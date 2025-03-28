import * as React from "react"
import
{
  Command,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import
{
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
// import NavProjects from "./nav-projects"
import NavUser from "./nav-user"
import { RouterTools } from "./HOC/WithRouter"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Geofeed Maintain",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Manage",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "All AS",
          url: "/dashboard/manageas",
        }
      ],
    },
  ],
}

interface AppSidebarProps
{
  routerTools: RouterTools

}

export class AppSidebar extends React.Component<React.ComponentProps<typeof Sidebar> & AppSidebarProps>
{
  render()
  {
    const { routerTools, ...props } = this.props;
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Geofeed Maintain</span>
                    <span className="truncate text-xs">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} routerTools={routerTools} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>

        {/* 底部 */}
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }
}