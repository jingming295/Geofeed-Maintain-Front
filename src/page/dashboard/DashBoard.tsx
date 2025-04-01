import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Component, ReactNode } from "react";
import { ManageAS } from "@/page/dashboard/AS/ManageAS";
import { Route, Routes } from "react-router-dom";
import { RouterTools, withRouter } from "@/components/HOC/WithRouter";

interface DashBoardProps
{
    onLogout: () => void
    routerTools: RouterTools
}

class DashBoard extends Component<DashBoardProps>
{

    render(): ReactNode
    {
        const { routerTools } = this.props
        return (
            <SidebarProvider>
                <AppSidebar
                    routerTools={routerTools}
                />
                <SidebarInset>
                    <header className="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb >
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Building Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <Separator className="h-px" orientation="horizontal" decorative />

                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <Routes>

                            <Route
                                path="/manage/*"
                                element={
                                    <Routes>
                                        <Route path="/as" element={<ManageAS />} />
                                    </Routes>
                                }
                            />
                        </Routes>

                    </div>

                </SidebarInset>
            </SidebarProvider>

        )
    }
}

const withRouterDashBoard = withRouter(DashBoard)

export default withRouterDashBoard