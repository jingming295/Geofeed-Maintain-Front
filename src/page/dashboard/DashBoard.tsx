import { AppSidebar } from "@/components/app-sidebar";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Component, ReactNode } from "react";
import { ManageAS } from "@/page/dashboard/AS/ManageAS";
import { Route, Routes } from "react-router-dom";
import { RouterTools, withRouter } from "@/components/HOC/WithRouter";
import { ASNData } from "@/types/ASN";
import { Request_ASN } from "@/request/asn/Request_ASN";
import { UserData } from "@/types/Auth";
import { ManagePrefixes } from "./Prefixes/ManagePrefixes";
import { EditPrefix } from "./Edit/EditPrefix";

interface DashBoardProps
{
    onLogout: () => void
    routerTools: RouterTools
    userData?: UserData | null

}

interface DashBoardState
{
    asData?: ASNData[];

}

class DashBoard extends Component<DashBoardProps, DashBoardState>
{

    state: DashBoardState = {
        asData: undefined
    };


    async componentDidMount(): Promise<void>
    {
        await this.renewASData(); // Fetch AS data when component mounts
    }

    renewASData = async () =>
    {
        const asndata = await Request_ASN.getASN()

        if (asndata.code === 0)
        {
            if (asndata.data)
            {
                this.setState({ asData: asndata.data });
            }
        }
    }

    render(): ReactNode
    {
        const { routerTools } = this.props
        const { asData } = this.state;
        return (
            <SidebarProvider>
                <AppSidebar
                    routerTools={routerTools}
                    asData={asData}
                    userData={this.props.userData}
                />
                <SidebarInset>
                    <header className="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {/* <Breadcrumb >
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
                            </Breadcrumb> */}
                        </div>
                    </header>
                    <Separator className="h-px" orientation="horizontal" decorative />

                    <div className="flex flex-1 flex-col gap-4 p-4 h-full overflow-hidden">
                        <Routes>

                            <Route
                                path="/manage/*"
                                element={
                                    <Routes>
                                        <Route path="/as" element={<ManageAS
                                            asData={asData}
                                            renewASData={this.renewASData}
                                        />} />

                                        <Route path="/prefixes" element={
                                            <ManagePrefixes
                                                routerTools={routerTools}
                                            />
                                        } />

                                        <Route path="/edit" element={
                                            <EditPrefix
                                                routerTools={routerTools}
                                            />
                                        } />
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