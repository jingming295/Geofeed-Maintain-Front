import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Component, ReactNode } from "react";
import DataTableDemo from "./ASTable";

export class ManageAS extends Component
{
    render(): ReactNode
    {
        return (
            <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800">Autonomous System</h1>
                <div className="flex justify-end">
                    <Button size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus />
                    </Button>
                </div>
                <div className="mt-4">
                    <DataTableDemo />
                </div>
            </div>
        );
    }
}