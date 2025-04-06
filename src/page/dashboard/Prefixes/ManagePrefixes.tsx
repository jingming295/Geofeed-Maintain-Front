import { RouterTools } from "@/components/HOC/WithRouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Request_Prefix } from "@/request/prefix/Request_Prefix";
import { PrefixData, PrefixDataWithAction } from "@/types/Prefix";
import { Component, ReactNode } from "react";
import PrefixTablewithTable from "./PrefixTable";

interface ManagePrefixesProps
{
    routerTools: RouterTools
}

interface ManagePrefixesState
{
    prefixData?: PrefixData[] // Define the type of prefixData if needed

}

export class ManagePrefixes extends Component<ManagePrefixesProps>
{

    state: ManagePrefixesState = {
        prefixData: undefined // Initialize prefixData as undefined
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
            prefixData: prefix.data
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
            <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg h-full">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Prefixes</h1>

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