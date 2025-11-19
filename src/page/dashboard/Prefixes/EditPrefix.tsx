import { RouterTools } from "@/components/HOC/WithRouter";
import { PrefixData, UpdatePrefixData } from "@/types/Prefix";
import { Component, ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Request_Location } from "@/request/location/Request_Location";
import { InputComboBox } from "@/components/InputComboBox";
import { LocationDataResponse } from "@/types/CountryData";
import { Request_Prefix } from "@/request/prefix/Request_Prefix";
import { Loader2 } from 'lucide-react'; // Assuming lucide-react is available
import { ToastType } from "@/App";
import
{
    DialogTitle,
    DialogHeader,
    DialogDescription
} from "@/components/ui/dialog";

interface EditPrefixProps
{
    routerTools: RouterTools;
    showMessage: (message: string, type?: ToastType) => void
    closeModal: () => void;
    renewASData: (switchprefix?: boolean) => Promise<void>

    prefixID: number;
}

interface EditPrefixState
{
    prefix: PrefixData;
    countryData: LocationDataResponse[];
    subDivisionData: LocationDataResponse[];
    cityData: LocationDataResponse[];
    zipcodeData: LocationDataResponse[];
    selected: UpdatePrefixData;
    isLoading: boolean;
    isSaving: boolean;
}

export class EditPrefix extends Component<EditPrefixProps, EditPrefixState>
{
    constructor(props: EditPrefixProps)
    {
        super(props);
        this.state = {
            prefix: {
                id: -1,
                Prefix: "",
                Country: null,
                SubDivisions: null,
                City: null,
                ZipCode: null
            },
            countryData: [],
            subDivisionData: [],
            cityData: [],
            zipcodeData: [],
            selected: {
                prefixID: 0,
                countryid: null,
                subdivisionsid: null,
                city: {
                    id: null,
                    name: null
                },
                zipCode: {
                    id: null,
                    name: null
                }
            },
            isLoading: true, // 初始加载状态
            isSaving: false,
        };
    }

    async componentDidMount()
    {
        this.setState({ isLoading: true });
        const prefixID = this.props.prefixID;

        if (prefixID)
        {
            const prefix = await Request_Prefix.getPrefixById(prefixID);

            // 当数据获取失败时，不再进行路由跳转，而是让父组件处理（例如关闭 Modal）
            if (prefix.code !== 0 || !prefix.data)
            {
                this.setState({
                    isLoading: false,
                });
                this.props.showMessage("Failed to load prefix data.", "error");
                return;
            }

            this.setState({
                prefix: prefix.data,
                selected: {
                    prefixID: prefixID,
                    countryid: prefix.data.Country ? prefix.data.Country.id : null,
                    subdivisionsid: prefix.data.SubDivisions ? prefix.data.SubDivisions.id : null,
                    city: {
                        id: prefix.data.City ? prefix.data.City.id : null,
                        name: null
                    },
                    zipCode: {
                        id: prefix.data.ZipCode ? prefix.data.ZipCode.id : null,
                        name: null
                    }
                }
            });

        } else
        {
            this.setState({
                isLoading: false,
            });
            this.props.showMessage("Invalid Prefix ID provided.", "error");
            return;
        }

        await this.updateCountryData();
        this.setState({ isLoading: false });

    }



    updateCountryData = async (): Promise<void> =>
    {
        const countryData = await Request_Location.getCountryList();
        if (countryData.code === 0 && countryData.data)
        {
            this.setState({ countryData: countryData.data });
        }

        if (this.state.selected.countryid)
        {
            this.updateSubDivisionData(this.state.selected.countryid);

            if (this.state.selected.subdivisionsid)
            {
                this.updateCityData(this.state.selected.countryid, this.state.selected.subdivisionsid || 0);
                if (this.state.selected.city.id)
                {
                    this.updateZipCodeData(this.state.selected.city.id);
                }
            } else
            {
                this.updateCityData(this.state.selected.countryid, -1);
                if (this.state.selected.city.id)
                {
                    this.updateZipCodeData(this.state.selected.city.id);
                }
            }
        }
    }

    updateSubDivisionData = async (countryID: number): Promise<void> =>
    {
        const subDivisionData = await Request_Location.getSubDivisionByCountry(countryID);
        if (subDivisionData.code === 0 && subDivisionData.data)
        {
            this.setState({ subDivisionData: subDivisionData.data });
        }
    }

    updateCityData = async (countryID: number, subdivisionID: number): Promise<void> =>
    {
        const cityData = await Request_Location.getCityBySubDivisionOrCountry(countryID, subdivisionID);
        if (cityData.code === 0 && cityData.data)
        {
            this.setState({ cityData: cityData.data });
        }
    }

    updateZipCodeData = async (cityID: number): Promise<void> =>
    {
        const zipcodeData = await Request_Location.getZipCodeByCityID(cityID);
        if (zipcodeData.code === 0 && zipcodeData.data)
        {
            this.setState({ zipcodeData: zipcodeData.data });
        }
    }

    // --- Handler Methods (Unchanged for brevity, except where noted) ---
    // Note: Removed redundant state update logic inside handlers to keep them clean.

    handleCountryChange = (countryID: number | null): void =>
    {
        // Reset lower-level selections
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                countryid: countryID,
                subdivisionsid: null,
                city: { id: null, name: null },
                zipCode: { id: null, name: null }
            },
            prefix: {
                ...prevState.prefix,
                Country: countryID ? prevState.countryData.find((country) => country.id === countryID) || null : null,
                SubDivisions: null,
                City: null,
                ZipCode: null
            },
            subDivisionData: [],
            cityData: [],
            zipcodeData: [],
        }));

        if (countryID)
        {
            this.updateSubDivisionData(countryID);
        }
    };

    handleSubDivisionChange = (subdivisionID: number | null): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                subdivisionsid: subdivisionID,
                city: { id: null, name: null },
                zipCode: { id: null, name: null }
            },
            prefix: {
                ...prevState.prefix,
                SubDivisions: subdivisionID ? prevState.subDivisionData.find((subdivision) => subdivision.id === subdivisionID) || null : null,
                City: null,
                ZipCode: null
            },
            cityData: [],
            zipcodeData: [],
        }));

        if (subdivisionID && this.state.selected.countryid)
        {
            this.updateCityData(this.state.selected.countryid, subdivisionID);
        }
    };

    handleCityChange = (cityID: number | null, cityName?: string): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                city: { id: cityID, name: cityName || null },
                zipCode: { id: null, name: null }
            },
            prefix: {
                ...prevState.prefix,
                City: cityID ? prevState.cityData.find((city) => city.id === cityID) || null : null,
                ZipCode: null
            },
            zipcodeData: [],
        }));

        if (cityID)
        {
            this.updateZipCodeData(cityID);
        }
    };

    handleZipCodeChange = (zipcodeID: number | null, zipcode?: string): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                zipCode: { id: zipcodeID, name: zipcode || null }
            },
            prefix: {
                ...prevState.prefix,
                ZipCode: zipcodeID ? prevState.zipcodeData.find((zipcode) => zipcode.id === zipcodeID) || null : null
            }
        }));
    };

    handleAddCity = async (cityName: string): Promise<void> =>
    {
        // Logic for adding temporary city
        this.setState((prevState) =>
        {
            const existingTemporaryCity = prevState.cityData.find((city) => city.id === -1);
            const updatedCityData = existingTemporaryCity
                ? prevState.cityData.map((city) => city.id === -1 ? { ...city, name: cityName } : city)
                : [...prevState.cityData, { id: -1, name: cityName }];

            return {
                selected: {
                    ...prevState.selected,
                    city: { id: -1, name: cityName },
                },
                cityData: updatedCityData,
            };
        });
    };

    handleAddZipCode = async (zipcodeName: string): Promise<void> =>
    {
        // Logic for adding temporary zipcode
        this.setState((prevState) =>
        {
            const existingTemporaryZipCode = prevState.zipcodeData.find((zipcode) => zipcode.id === -1);
            const updatedZipCodeData = existingTemporaryZipCode
                ? prevState.zipcodeData.map((zipcode) => zipcode.id === -1 ? { ...zipcode, name: zipcodeName } : zipcode)
                : [...prevState.zipcodeData, { id: -1, name: zipcodeName }];


            return {
                selected: {
                    ...prevState.selected,
                    zipCode: { id: -1, name: zipcodeName },
                },
                zipcodeData: updatedZipCodeData,
            };
        });
    };

    handleSaveChanges = async (): Promise<void> =>
    {
        this.setState({ isSaving: true });

        const { selected } = this.state;
        const response = await Request_Prefix.updatePrefixLocation(selected.prefixID, selected);

        this.setState({ isSaving: false });

        if (response.code === 0)
        {
            this.props.showMessage("Prefix updated successfully!", "success");
            await this.props.renewASData(false); // Refresh AS data after successful update
            this.props.closeModal(); // Close the modal after successful save
        } else
        {
            console.error("Error updating prefix:", response.message);
            this.props.showMessage(`Failed to save changes: ${response.message}`, "error");
        }
    }

    render(): ReactNode
    {
        const { prefix, countryData, subDivisionData, cityData, zipcodeData, isSaving } = this.state;
        // 移除外部的居中和背景 div，仅保留卡片本身，以便它能更好地融入父级 Modal 容器
        return (
            <Card className="relative w-full max-w-xl p-6 rounded-xl shadow-2xl  border-none transition-all duration-300" // 阻止触发关闭
            >
                <CardHeader className="mb-4 p-0">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-extrabold text-gray-900 border-b pb-2">Edit Prefix Location</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-base text-gray-600">
                    </DialogDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-6">

                        {/* Prefix (Read-only) */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="prefix-readonly" className="text-sm font-semibold text-gray-700">
                                Network Prefix
                            </label>
                            <Input
                                id="prefix-readonly"
                                value={prefix.Prefix}
                                readOnly
                                className="max-w-full bg-gray-100 font-mono text-lg cursor-default border-dashed border-gray-300"
                            />
                        </div>

                        {/* Location Selectors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Country */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="country" className="text-sm font-semibold text-gray-700">
                                    Country
                                </label>
                                <InputComboBox
                                    items={countryData}
                                    selectedValue={this.state.selected.countryid}
                                    setValue={this.handleCountryChange}
                                    placeholder="Select Country"
                                />
                            </div>

                            {/* Subdivision */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="subdivision" className="text-sm font-semibold text-gray-700">
                                    Subdivision / State
                                </label>
                                <InputComboBox
                                    items={subDivisionData}
                                    selectedValue={this.state.selected.subdivisionsid}
                                    setValue={this.handleSubDivisionChange}
                                    placeholder="Select Subdivision"
                                />
                            </div>

                            {/* City */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="city" className="text-sm font-semibold text-gray-700">
                                    City
                                </label>
                                <InputComboBox
                                    items={cityData}
                                    selectedValue={this.state.selected.city?.id}
                                    setValue={this.handleCityChange}
                                    handleAdd={this.handleAddCity}
                                    placeholder="Select or Add City"
                                />
                            </div>

                            {/* ZipCode */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="zipcode" className="text-sm font-semibold text-gray-700">
                                    ZipCode
                                </label>
                                <InputComboBox
                                    items={zipcodeData}
                                    selectedValue={this.state.selected.zipCode?.id}
                                    setValue={this.handleZipCodeChange}
                                    handleAdd={this.handleAddZipCode}
                                    placeholder="Select or Add ZipCode"
                                />
                            </div>
                        </div>


                        {/* Save Button */}
                        <Button
                            className="w-full rounded-lg py-2 px-4 h-11 
                                           bg-blue-600 text-white shadow-lg 
                                           hover:bg-blue-700 hover:shadow-blue-500/50 
                                           transition duration-300 ease-in-out font-bold text-base"
                            onClick={this.handleSaveChanges}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>

                    </div>
                </CardContent>
            </Card>
        );
    }
}