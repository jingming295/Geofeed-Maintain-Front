export type PrefixData = {
    id: number;
    Prefix: string;
    Country: string | null;
    SubDivisions: string | null;
    City: string | null;
    ZipCode: string | null;
};

export type PrefixDataWithAction = {
    id: number;
    Prefix: string;
    Country: string | null;
    SubDivisions: string | null;
    City: string | null;
    ZipCode: string | null;
    action?: () => void; // Optional action function
}