import * as React from "react"
import
{
  Command,
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
import { ASNData } from "@/types/ASN"
import { UserData } from "@/types/Auth"

interface AppSidebarProps
{
  routerTools: RouterTools
  asData?: ASNData[];
  userData?: UserData | null

}

export class AppSidebar extends React.Component<React.ComponentProps<typeof Sidebar> & AppSidebarProps>
{

  constructor(props: React.ComponentProps<typeof Sidebar> & AppSidebarProps)
  {
    super(props);
  }

  render()
  {
    const { routerTools, asData, ...props } = this.props;
    const user = {
      name: '',
      email: '',
      avatar: '',
    }

    if (this.props.userData)
    {
      user.name = this.props.userData.email.split("@")[0]
      user.email = this.props.userData.email
      user.avatar = this.props.userData.avatar
    }

    const navManageItems = [
      {
        title: "All AS",
        url: "/dashboard/manage/as",
      }
    ]

    if (asData)
    {
      asData.forEach((item) =>
      {
        navManageItems.push({
          title: item.asn.asName,
          url: `/dashboard/manage/prefixes?as=${item.asn.asNumber}`,
        })
      })
    }

    const navMain = [
      {
        title: "Manage",
        url: "",
        icon: SquareTerminal,
        isActive: true,
        items: navManageItems
      },
    ]

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
          <NavMain items={navMain} routerTools={routerTools} />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>

        {/* 底部 */}
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }
}