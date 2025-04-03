import { RouterTools } from "@/components/HOC/WithRouter";
import { PrefixData } from "@/types/Prefix";
import { Component, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditPrefixProps
{
    routerTools: RouterTools;
}

interface EditPrefixState
{
    prefix?: PrefixData;
}

export class EditPrefix extends Component<EditPrefixProps, EditPrefixState>
{
    constructor(props: EditPrefixProps)
    {
        super(props);
        this.state = {
            prefix: undefined,
        };
    }

    componentDidMount()
    {
        const { routerTools } = this.props;
        const prefixID = routerTools.searchParams.get("prefixid");
        const country = routerTools.searchParams.get("country");
        const subdivision = routerTools.searchParams.get("subdivision");
        const city = routerTools.searchParams.get("city");
        const zipcode = routerTools.searchParams.get("zipcode");
        const prefix = routerTools.searchParams.get("prefix");

        if (prefixID)
        {
            const prefixData: PrefixData = {
                id: parseInt(prefixID),
                Country: country || "",
                SubDivisions: subdivision || "",
                City: city || "",
                ZipCode: zipcode || "",
                Prefix: prefix || "",
            };
            this.setState({ prefix: prefixData });
        } else
        {
            routerTools.navigate("/dashboard/manage/as");
        }
    }

    render(): ReactNode
    {
        const { prefix } = this.state;

        return (
            <div className="flex justify-center items-center bg-gray-100 h-full">
                <Card className="w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-800">
                            Edit Prefix
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                            Modify prefix details below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {prefix ? (
                            <div className="space-y-6">
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="prefix" className="text-sm font-medium text-gray-700">
                                        Prefix
                                    </label>
                                    <Input
                                        id="prefix"
                                        value={prefix.Prefix}
                                        readOnly
                                        className="max-w-full bg-gray-50"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="country" className="text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <Input
                                        id="country"
                                        value={prefix.Country || "-"}
                                        readOnly
                                        className="max-w-full bg-gray-50"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="subdivision" className="text-sm font-medium text-gray-700">
                                        Subdivision
                                    </label>
                                    <Input
                                        id="subdivision"
                                        value={prefix.SubDivisions || "-"}
                                        readOnly
                                        className="max-w-full bg-gray-50"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <Input
                                        id="city"
                                        value={prefix.City || "-"}
                                        readOnly
                                        className="max-w-full bg-gray-50"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="zipcode" className="text-sm font-medium text-gray-700">
                                        ZipCode
                                    </label>
                                    <Input
                                        id="zipcode"
                                        value={prefix.ZipCode || "-"}
                                        readOnly
                                        className="max-w-full bg-gray-50"
                                    />
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    Save Changes
                                </Button>
                            </div>
                        ) : (
                            <Skeleton className="h-40 w-full rounded" />
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }
}
