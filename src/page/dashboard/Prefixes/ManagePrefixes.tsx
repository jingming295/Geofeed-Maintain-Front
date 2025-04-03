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

    navigateToEditPrefix = (prefixId: number, prefix: string, country: string, subdivision: string, city: string, zipcode: string): void =>
    {
        const { routerTools } = this.props;
        routerTools.navigate(`/dashboard/manage/edit?prefixid=${prefixId}&country=${country}&subdivision=${subdivision}&city=${city}&zipcode=${zipcode}&prefix=${prefix}`);
    }

    render(): ReactNode
    {
        const { prefixData } = this.state

        const prefixWithAction: PrefixDataWithAction[] = prefixData?.map((prefix) => ({
            ...prefix,
            action: () => this.navigateToEditPrefix(prefix.id, prefix.Prefix, prefix.Country || '-', prefix.SubDivisions || '-', prefix.City || '-', prefix.ZipCode || '-'), // Add action function for each prefix
        })) || [];


        return (
            <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg h-full">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Prefixes</h1>

                <div className="mt-4 h-full overflow-hidden">
                    {prefixData ? (
                        <PrefixTablewithTable
                            prefixData={prefixWithAction} // Pass data to the table component
                        />
                    ) : (
                        <Skeleton className="h-72 w-full" /> // Display skeleton when data is undefined
                    )}
                </div>
            </div>


        )
    }
}