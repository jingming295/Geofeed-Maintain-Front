export type PrefixData = {
    id: number;
    Prefix: string
    Country: LocationData | null;
    SubDivisions: LocationData | null;
    City: LocationData | null;
    ZipCode: LocationData | null;
};

type LocationData = {
    id: number;
    name: string;
}
export type PrefixDataWithAction = {
    id: number;
    Prefix: string;
    Country: string | null;
    SubDivisions: string | null;
    City: string | null;
    ZipCode: string | null;
    action?: () => void; // Optional action function
}

export type UpdatePrefixData = {
    prefixID: number;
    countryid: number | null;
    subdivisionsid: number | null;
    city: {
        id: number | null;
        name: string | null;
    }
    zipCode: {
        id: number | null;
        name: string | null;
    }
}