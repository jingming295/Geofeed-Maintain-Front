import { RouterTools } from "@/components/HOC/WithRouter";
import { Component, ReactNode } from "react";

interface ManagePrefixesProps
{
    routerTools: RouterTools
}

export class ManagePrefixes extends Component<ManagePrefixesProps>
{
    render(): ReactNode
    {
        return (
            <div className="flex flex-col w-full h-full">
                <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
                    <h1 className="text-lg font-semibold">Manage Prefixes</h1>
                    <button
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        onClick={() => this.props.routerTools.navigate("/dashboard/prefixes/add")}
                    >
                        Add Prefix
                    </button>
                </div>
                <div className="flex-grow p-4">
                    {/* Content for managing prefixes goes here */}
                </div>
            </div>
        )
    }
}