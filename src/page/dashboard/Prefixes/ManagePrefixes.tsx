import { RouterTools } from "@/components/HOC/WithRouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Request_Prefix } from "@/request/prefix/Request_Prefix";
import { PrefixData, PrefixDataWithAction } from "@/types/Prefix";
import { Component, ReactNode } from "react";
import PrefixTablewithTable from "./PrefixTable";
import { Button } from "@/components/ui/button";
import { Request_ASN } from "@/request/asn/Request_ASN";
import { ToastType } from "@/App";
import { SendRequest } from "@/request/SendRequest";

interface ManagePrefixesProps
{
    routerTools: RouterTools
    showMessage: (message: string, type?: ToastType) => void

}

interface ManagePrefixesState
{
    prefixData?: PrefixData[] // Define the type of prefixData if needed
    asnumber?: string

}

export class ManagePrefixes extends Component<ManagePrefixesProps>
{

    state: ManagePrefixesState = {
        prefixData: undefined, // Initialize prefixData as undefined
        asnumber: undefined
    }
    async componentDidMount(): Promise<void>
    {
        const { routerTools } = this.props;

        const { searchParams } = routerTools

        const as = searchParams.get("as")

        if (!as)
        {
            routerTools.navigate("/dashboard/manage/as")
            return
        }

        const prefix = await Request_Prefix.getPrefix(as)

        if (prefix.code !== 0 || !prefix.data)
        {
            routerTools.navigate("/dashboard/manage/as")
            return
        }

        this.setState({
            prefixData: prefix.data,
            asnumber: as
        })


    }

    navigateToEditPrefix = (pd: PrefixData): void =>
    {
        const { routerTools } = this.props;

        // 动态构造查询参数，仅在字段存在时添加
        const queryParams: Record<string, string> = {};

        queryParams.prefixid = pd.id.toString(); // id 必须存在

        // 构造查询字符串
        const filteredParams = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // 编码键值对
            .join('&'); // 拼接查询字符串

        // 导航到目标页面
        routerTools.navigate(`/dashboard/manage/edit?${filteredParams}`);
    };

    onRebuildFeed = async (): Promise<void> =>
    {
        const { showMessage } = this.props

        const { asnumber } = this.state
        if (!asnumber) return
        const res = await Request_ASN.rebuildFeed(asnumber)

        if (res.code === 0)
        {
            showMessage("Rebuild Feed Success", "success")
        } else
        {
            showMessage(res.message, "warning")
        }
    }

    onRefresh = async (): Promise<void> =>
    {
        const { asnumber } = this.state
        const { showMessage } = this.props
        if (!asnumber) return

        const refreshResult = await Request_ASN.refreshASNPrefix(asnumber)

        if (refreshResult.code === 0)
        {
            showMessage("Refresh ASN Prefix Success", "success")
            const prefix = await Request_Prefix.getPrefix(asnumber)

            if (prefix.code !== 0 || !prefix.data)
            {
                this.setState({
                    prefixData: undefined,
                })
                return
            }

            this.setState({
                prefixData: prefix.data,
            })

        } else
        {
            showMessage(refreshResult.message, "warning")
        }


    }

    onCopyCsvLink = async (): Promise<void> =>
    {
        const { asnumber } = this.state;
        const { showMessage } = this.props;

        // 构建目标链接
        const serverUrl = `${SendRequest.backendUrl}geofeed/${asnumber}/geofeed.csv`;

        try
        {
            // 使用 Clipboard API 将链接复制到剪切板
            await navigator.clipboard.writeText(serverUrl);

            // 显示成功信息
            showMessage("Link copied to clipboard!");
        } catch (error)
        {
            console.error("Failed to copy the link:", error);
            showMessage("Failed to copy the link. Please try again.", "error");
        }
    };


    render(): ReactNode
    {
        const { prefixData } = this.state;

        // Helper method to transform prefixData into prefixWithAction
        const mapPrefixWithAction = (prefixData: PrefixData[]): PrefixDataWithAction[] =>
            prefixData.map((prefix) => ({
                id: prefix.id,
                Prefix: prefix.Prefix,
                Country: prefix.Country?.name || null,
                SubDivisions: prefix.SubDivisions?.name || null,
                City: prefix.City?.name || null,
                ZipCode: prefix.ZipCode?.name || null,
                action: () => this.navigateToEditPrefix({
                    id: prefix.id,
                    Prefix: prefix.Prefix,
                    Country: prefix.Country || null,
                    SubDivisions: prefix.SubDivisions || null,
                    City: prefix.City || null,
                    ZipCode: prefix.ZipCode || null,
                }),
            }));

        // Process data if it's available
        const prefixWithAction: PrefixDataWithAction[] = prefixData ? mapPrefixWithAction(prefixData) : [];

        return (
            <div className="flex flex-col gap-4 p-6 bg-white shadow rounded-lg h-full">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Prefixes</h1>

                <div className="flex gap-8 justify-end dark:bg-gray-900 p-4">
                    <Button
                        onClick={this.onCopyCsvLink}

                        className="rounded-lg py-2 px-4 bg-gray-800 text-gray-100 shadow-lg hover:bg-gray-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out">
                        Copy Link
                    </Button>
                    <Button
                        onClick={this.onRefresh}

                        className="rounded-lg py-2 px-4 bg-gray-800 text-gray-100 shadow-lg hover:bg-gray-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out">
                        Refresh
                    </Button>
                    <Button
                        onClick={this.onRebuildFeed}
                        className="rounded-lg py-2 px-4 bg-gray-800 text-gray-100 shadow-lg hover:bg-gray-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out">
                        Rebuild Feed
                    </Button>
                </div>



                <div className="mt-4 h-full overflow-hidden">
                    {prefixData ? (
                        <PrefixTablewithTable prefixData={prefixWithAction} />
                    ) : (
                        <div className="text-gray-500 flex items-center justify-center h-72 w-full">
                            <Skeleton className="h-72 w-full" />
                            <span>Loading prefixes, please wait...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

}