import { RouterTools } from "@/components/HOC/WithRouter";
import { PrefixData, UpdatePrefixData } from "@/types/Prefix";
import { Component, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Request_Location } from "@/request/location/Request_Location";
import { InputComboBox } from "@/components/InputComboBox";
import { LocationDataResponse } from "@/types/CountryData";
import { Request_Prefix } from "@/request/prefix/Request_Prefix";

interface EditPrefixProps
{
    routerTools: RouterTools;
}

interface EditPrefixState
{
    prefix: PrefixData;
    countryData: LocationDataResponse[];
    subDivisionData: LocationDataResponse[];
    cityData: LocationDataResponse[];
    zipcodeData: LocationDataResponse[];
    selected: UpdatePrefixData
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
            }
        };
    }

    async componentDidMount()
    {
        const { routerTools } = this.props;

        // Helper function to convert to number | null
        const toNumberOrNull = (value: string | null): number | null =>
            value && !isNaN(parseInt(value)) ? parseInt(value) : null;


        // Use the helper function for conversion
        const prefixID = toNumberOrNull(routerTools.searchParams.get("prefixid"));

        if (prefixID)
        {
            const prefix = await Request_Prefix.getPrefixById(prefixID);


            if (prefix.code !== 0 || !prefix.data)
            {
                routerTools.navigate("/dashboard/manage/as");
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
            routerTools.navigate("/dashboard/manage/as");
        }


        await this.updateCountryData();

    }

    updateCountryData = async (): Promise<void> =>
    {
        const countryData = await Request_Location.getCountryList();
        if (countryData.code === 0)
        {
            if (countryData.data)
            {
                this.setState({
                    countryData: countryData.data
                });
            }
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
            }

        }
    }

    updateSubDivisionData = async (countryID: number): Promise<void> =>
    {
        const subDivisionData = await Request_Location.getSubDivisionByCountry(countryID);
        if (subDivisionData.code === 0)
        {
            if (subDivisionData.data)
            {
                this.setState({
                    subDivisionData: subDivisionData.data
                });
            }
        }
    }

    updateCityData = async (countryID: number, subdivisionID: number): Promise<void> =>
    {
        const cityData = await Request_Location.getCityBySubDivisionOrCountry(countryID, subdivisionID);
        if (cityData.code === 0)
        {
            if (cityData.data)
            {
                this.setState({
                    cityData: cityData.data
                });
            }
        }
    }

    updateZipCodeData = async (cityID: number): Promise<void> =>
    {
        const zipcodeData = await Request_Location.getZipCodeByCityID(cityID);
        if (zipcodeData.code === 0)
        {
            if (zipcodeData.data)
            {
                this.setState({
                    zipcodeData: zipcodeData.data
                });
            }
        }
    }

    handleCountryChange = (countryID: number | null): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                countryid: countryID,
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
        }));

        const { countryData } = this.state;

        this.setState((prevState) => ({
            prefix: {
                ...prevState.prefix,
                Country: countryData.find((country) => country.id === countryID) || null
            }
        }))

        if (countryID)
        {
            this.updateSubDivisionData(countryID);
        } else
        {
            this.setState({
                subDivisionData: []
            });
        }

    };

    handleSubDivisionChange = (subdivisionID: number | null): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                subdivisionsid: subdivisionID,
                city: {
                    id: null,
                    name: null
                },
                zipCode: {
                    id: null,
                    name: null
                }
            },
        }));

        const { subDivisionData } = this.state;

        this.setState((prevState) => ({
            prefix: {
                ...prevState.prefix,
                SubDivisions: subDivisionData.find((subdivision) => subdivision.id === subdivisionID) || null
            }
        }))

        if (subdivisionID && this.state.selected.countryid)
        {
            this.updateCityData(this.state.selected.countryid, subdivisionID);
        } else
        {
            this.setState({
                cityData: []
            });
        }

    };

    handleCityChange = (cityID: number | null, cityName?: string): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                city: {
                    id: cityID,
                    name: cityName || null
                },
                zipCode: {
                    id: null,
                    name: null
                }
            },
        }));

        const { cityData } = this.state;

        this.setState((prevState) => ({
            prefix: {
                ...prevState.prefix,
                City: cityData.find((city) => city.id === cityID) || null
            }
        }))

        if (cityID)
        {
            this.updateZipCodeData(cityID);
        } else
        {
            this.setState({
                zipcodeData: []
            });
        }
    };

    handleZipCodeChange = (zipcodeID: number | null, zipcode?: string): void =>
    {
        this.setState((prevState) => ({
            selected: {
                ...prevState.selected,
                zipCode: {
                    id: zipcodeID,
                    name: zipcode || null
                },
            },
        }));

        const { zipcodeData } = this.state;

        this.setState((prevState) => ({
            prefix: {
                ...prevState.prefix,
                ZipCode: zipcodeData.find((zipcode) => zipcode.id === zipcodeID) || null
            }
        }))



    };

    handleAddCity = async (cityName: string): Promise<void> =>
    {
        this.setState((prevState) =>
        {
            // 检查是否已经存在 id 为 -1 的城市
            const existingTemporaryCity = prevState.cityData.find((city) => city.id === -1);

            // 如果存在，更新该城市的 name；否则添加新的城市
            const updatedCityData = existingTemporaryCity
                ? prevState.cityData.map((city) =>
                    city.id === -1 ? { ...city, name: cityName } : city
                )
                : [
                    ...prevState.cityData,
                    {
                        id: -1,
                        name: cityName,
                    },
                ];

            return {
                selected: {
                    ...prevState.selected,
                    city: {
                        id: -1,
                        name: cityName,
                    },
                },
                cityData: updatedCityData,
            };
        });
    };

    handleAddZipCode = async (zipcodeName: string): Promise<void> =>
    {
        this.setState((prevState) =>
        {
            // 检查是否已经存在 id 为 -1 的城市
            const existingTemporaryZipCode = prevState.zipcodeData.find((zipcode) => zipcode.id === -1);

            // 如果存在，更新该城市的 name；否则添加新的城市
            const updatedZipCodeData = existingTemporaryZipCode
                ? prevState.zipcodeData.map((zipcode) =>
                    zipcode.id === -1 ? { ...zipcode, name: zipcodeName } : zipcode
                )
                : [
                    ...prevState.zipcodeData,
                    {
                        id: -1,
                        name: zipcodeName,
                    },
                ];


            return {
                selected: {
                    ...prevState.selected,
                    zipCode: {
                        id: -1,
                        name: zipcodeName,
                    },
                },
                zipcodeData: updatedZipCodeData,
            };
        });


    };

    handleSaveChanges = async (): Promise<void> =>
    {
        const { selected } = this.state;
        const { routerTools } = this.props;

        const response = await Request_Prefix.updatePrefixLocation(selected.prefixID, selected);

        if (response.code === 0)
        {
            routerTools.navigate("/dashboard/manage/as");
        } else
        {
            console.error("Error updating prefix:", response.message);
        }
    }
    render(): ReactNode
    {
        const { prefix, countryData, subDivisionData, cityData, zipcodeData } = this.state;
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
                                        id="country"
                                        value={prefix.Prefix}
                                        readOnly
                                        className="max-w-full bg-gray-50 cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="country" className="text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <InputComboBox
                                        items={countryData}
                                        selectedValue={this.state.selected.countryid}
                                        setValue={this.handleCountryChange}
                                        placeholder="country"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="subdivision" className="text-sm font-medium text-gray-700">
                                        Subdivision
                                    </label>

                                    <InputComboBox
                                        items={subDivisionData}
                                        selectedValue={this.state.selected.subdivisionsid}
                                        setValue={this.handleSubDivisionChange}
                                        placeholder="subdivision"
                                    />

                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <InputComboBox
                                        items={cityData}
                                        selectedValue={this.state.selected.city?.id}
                                        setValue={this.handleCityChange}
                                        handleAdd={this.handleAddCity}
                                        placeholder="city"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="zipcode" className="text-sm font-medium text-gray-700">
                                        ZipCode
                                    </label>
                                    <InputComboBox
                                        items={zipcodeData}
                                        selectedValue={this.state.selected.zipCode?.id}
                                        setValue={this.handleZipCodeChange}
                                        handleAdd={this.handleAddZipCode}
                                        placeholder="zipcode"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={this.handleSaveChanges}
                                >
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
