import { Button } from "@/components/ui/button";
import { Component, ReactNode } from "react";
import DataTableDemo from "./ASTable";
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

interface ManageASState
{
    asn: string;
}

export class ManageAS extends Component<object, ManageASState>
{
    state: ManageASState = {
        asn: "",
    };

    handleAddAS = () =>
    {
        console.log("Adding AS Number:", this.state.asn);
        // Reset the input field after submission
        this.setState({ asn: "" });
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        this.setState({ asn: event.target.value });
    };

    render(): ReactNode
    {
        return (
            <div className="flex flex-col gap-6 p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Autonomous Systems</h1>
                <div className="flex justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
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
                    <DataTableDemo />
                </div>
            </div>
        );
    }
}
