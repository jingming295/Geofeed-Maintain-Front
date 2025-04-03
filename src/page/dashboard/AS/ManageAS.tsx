import { Button } from "@/components/ui/button";
import { Component, ReactNode } from "react";
import ASTable, { ASData } from "./ASTable";
import
{
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Request_ASN } from "@/request/asn/Request_ASN";
import { ASNData } from "@/types/ASN";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

interface ManageASState
{
    asn: string;
}

interface ManageASProps
{
    asData?: ASNData[];
    renewASData: () => Promise<void>
}

export class ManageAS extends Component<ManageASProps, ManageASState>
{
    state: ManageASState = {
        asn: "",
    };





    handleAddAS = () =>
    {
        const { asn } = this.state;
        const { renewASData } = this.props; // Destructure renewASData from props
        if (!asn.trim())
        {
            return; // Prevent submission if input is empty
        }

        Request_ASN.addASN(asn).then(async (response) =>
        {
            if (response.code === 0)
            {
                await renewASData(); // Refresh AS data after successful addition
            }
            else
            {
                console.error("Error adding AS:", response.message);
            }
        }).catch((error) =>
        {
            console.error("Error during AS addition:", error);
        });

        // Reset the input field after submission
        this.setState({ asn: "" });
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        this.setState({ asn: event.target.value });
    };

    render(): ReactNode
    {
        const { asData } = this.props; // Extract asData from state
        let tableASData: ASData[] | undefined
        if (asData)
            tableASData = asData.map((data) =>
            {
                return {
                    ASNumber: data.asn.asNumber,
                    Prefixes: data.asn.prefixCount,
                    PrefixesWithGeolocation: data.asn.prefixCountWithGeo,
                    Status: data.asn.status,
                };
            })

        return (
            <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg h-full">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Autonomous Systems</h1>
                <div className="flex justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon">
                                <Plus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Autonomous System (AS) Number</DialogTitle>
                                <DialogDescription>
                                    Enter the AS number you wish to add. Make sure the number is valid before submission.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="asn" className="text-right">
                                        AS Number
                                    </Label>
                                    <Input
                                        id="asn"
                                        placeholder="e.g., 64512"
                                        value={this.state.asn}
                                        onChange={this.handleChange}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        type="submit"
                                        onClick={this.handleAddAS}
                                        disabled={!this.state.asn.trim()} // Disable button if input is empty
                                    >
                                        ADD
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-4">
                    {tableASData ? (
                        <ASTable
                            asData={tableASData} // Pass data to the table component
                        />
                    ) : (
                        <Skeleton className="h-72 w-full" /> // Display skeleton when data is undefined
                    )}
                </div>
            </div>
        );
    }
}