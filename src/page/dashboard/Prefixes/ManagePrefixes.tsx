import { RouterTools } from "@/components/HOC/WithRouter";
import { Request_Prefix } from "@/request/prefix/Request_Prefix";
import { PrefixData, PrefixDataWithAction } from "@/types/Prefix";
import { Component, ReactNode } from "react";
import PrefixTablewithTable from "./PrefixTable";
import { Button } from "@/components/ui/button";
import { Request_ASN } from "@/request/asn/Request_ASN";
import { ToastType } from "@/App";
import { SendRequest } from "@/request/SendRequest";
import { Copy, LocateFixed, RotateCw, Wrench } from "lucide-react";
import { EditPrefix } from "./EditPrefix";
import
{
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";


interface ManagePrefixesProps
{
    routerTools: RouterTools
    showMessage: (message: string, type?: ToastType) => void
}

interface ManagePrefixesState
{
    prefixData?: PrefixData[] // Define the type of prefixData if needed
    asnumber?: string
    editPrefixID?: number
    editPrefixOpen: boolean
    onrebuildfeed: boolean | undefined
    onrefreshprefix: boolean | undefined
    onAutoGenGeolocation: boolean | undefined
}

export class ManagePrefixes extends Component<ManagePrefixesProps>
{
    autoCheckLockInterval: NodeJS.Timeout | null = null;
    state: ManagePrefixesState = {
        prefixData: undefined, // Initialize prefixData as undefined
        asnumber: undefined,
        editPrefixID: undefined,
        editPrefixOpen: false,
        onrebuildfeed: undefined,
        onrefreshprefix: undefined,
        onAutoGenGeolocation: undefined
    }
    async componentDidMount(): Promise<void>
    {
        await this.initasData()
        this.checkLock()
        this.autoCheckLockInterval = setInterval(this.checkLock, 1000);


    }

    componentWillUnmount()
    {
        if (this.autoCheckLockInterval)
        {
            clearInterval(this.autoCheckLockInterval);
        }
    }

    async componentDidUpdate(): Promise<void>
    {
        const { routerTools } = this.props;

        const { searchParams } = routerTools

        const as = searchParams.get("as")
        if (as !== this.state.asnumber)
        {
            await this.initasData()
        }
    }

    checkLock = () =>
    {
        const { asnumber } = this.state;
        if (!asnumber) return;

        Request_ASN.checkLock(asnumber).then((res) =>
        {
            if (res.code === 0 && res.data)
            {
                this.setState({
                    onrebuildfeed: res.data.rebuildFeed,
                    onrefreshprefix: res.data.refreshPrefix,
                    onAutoGenGeolocation: res.data.autoGenerateFeed
                });
            }
        });
    }

    initasData = async (switchprefix = true): Promise<void> =>
    {
        const { routerTools } = this.props;

        const { searchParams } = routerTools

        const as = searchParams.get("as")
        if ((this.state.asnumber || this.state.prefixData) && switchprefix)
        {
            this.setState({
                prefixData: undefined,
                asnumber: undefined
            })
        }

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


    openEditPrefix = (pd: PrefixData): void =>
    {
        this.setState({
            editPrefixID: pd.id,
            editPrefixOpen: true
        })

    };

    onRebuildFeed = async (): Promise<void> =>
    {
        const { showMessage } = this.props

        this.setState({ onrebuildfeed: true })

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

        this.setState({ onrebuildfeed: false })
    }

    onRefresh = async (): Promise<void> =>
    {
        const { asnumber } = this.state
        const { showMessage } = this.props
        if (!asnumber) return

        this.setState({ onrefreshprefix: true })

        try
        {
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
        } finally
        {
            this.setState({ onrefreshprefix: false })
        }
    }

    onCopyCsvLink = async (): Promise<void> =>
    {
        const { asnumber } = this.state;
        const { showMessage } = this.props;

        // 构建目标链接
        const serverUrl = `${SendRequest.backendUrl}/geofeed/${asnumber}/geofeed.csv`;

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

    autoGenerateGeolocations = async (): Promise<void> =>
    {
        const { asnumber } = this.state
        const { showMessage } = this.props
        if (!asnumber) return

        this.setState({ onAutoGenGeolocation: true })

        const autoGenResult = await Request_Prefix.autoGenGeolocation(asnumber)

        if (autoGenResult.code === 0)
        {
            showMessage("Auto Generate Geolocations Success", "success")
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
            showMessage(autoGenResult.message, "warning")
        }

        this.setState({ onAutoGenGeolocation: false })

    }

    render(): ReactNode
    {
        const { prefixData, editPrefixOpen, editPrefixID } = this.state;
        const { routerTools, showMessage } = this.props;
        // Helper method to transform prefixData into prefixWithAction
        const mapPrefixWithAction = (prefixData: PrefixData[]): PrefixDataWithAction[] =>
            // ... (mapPrefixWithAction 保持不变)

            prefixData.map((prefix) => ({
                id: prefix.id,
                Prefix: prefix.Prefix,
                Country: prefix.Country?.name || null,
                SubDivisions: prefix.SubDivisions?.name || null,
                City: prefix.City?.name || null,
                ZipCode: prefix.ZipCode?.name || null,
                action: () => this.openEditPrefix({
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

                <Dialog open={editPrefixOpen} onOpenChange={(editPrefixOpen) => this.setState({ editPrefixOpen })}>
                    <DialogContent className="p-0">
                        {
                            editPrefixID ? (
                                <EditPrefix
                                    routerTools={routerTools}
                                    prefixID={editPrefixID}
                                    showMessage={showMessage}
                                    closeModal={() => this.setState({ editPrefixOpen: false, editPrefixID: undefined })}
                                    renewASData={this.initasData}
                                />
                            ) : null
                        }


                    </DialogContent>
                </Dialog>

                <h1 className="text-2xl font-semibold text-gray-800">Manage Prefixes</h1>

                {/* ... (Buttons section) ... */}
                <div className="flex gap-8 justify-end dark:bg-gray-900 p-4">
                    <Button
                        onClick={this.onCopyCsvLink}
                        className="rounded-lg py-2 px-4 bg-gray-800 text-gray-100 shadow-lg hover:bg-gray-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out">
                        <Copy />
                        Copy Link
                    </Button>
                    <Button
                        onClick={this.onRefresh}
                        disabled={this.state.onrefreshprefix || this.state.onAutoGenGeolocation === undefined}
                        className="rounded-lg py-2 px-4 bg-gray-800 text-gray-100 shadow-lg hover:bg-gray-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out">
                        {
                            this.state.onrefreshprefix ? <Spinner /> : <RotateCw />
                        }
                        Refresh Prefixes
                    </Button>
                    <Button
                        onClick={this.autoGenerateGeolocations}
                        disabled={this.state.onAutoGenGeolocation || this.state.onrefreshprefix === undefined}
                        className="rounded-lg py-2 px-4 bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out whitespace-nowrap">

                        {
                            this.state.onAutoGenGeolocation ? <Spinner /> : < LocateFixed />
                        }
                        Auto Generate Geolocation
                    </Button>
                    <Button
                        onClick={this.onRebuildFeed}
                        disabled={this.state.onrebuildfeed || this.state.onrefreshprefix === undefined}
                        className="rounded-lg py-2 px-4 bg-gray-800 text-gray-100 shadow-lg hover:bg-gray-700 hover:shadow-blue-500/50 transition duration-300 ease-in-out">
                        {
                            this.state.onrebuildfeed ? <Spinner /> : <Wrench />
                        }
                        Rebuild Feed
                    </Button>
                </div>



                <div className="mt-4 h-full overflow-hidden">
                    {prefixData ? (
                        <PrefixTablewithTable prefixData={prefixWithAction} />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            {/* 使用一个 Div 来模拟 Skeleton，并将文字居中 */}
                            <div className="
                                    flex items-center justify-center 
                                    w-full min-h-[300px] h-full rounded-md 
                                    bg-gray-200 dark:bg-gray-700 
                                    animate-pulse
                                ">
                                <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                    Loading prefixes, please wait...
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }




}