import { CommonReturn } from "@/types/SendRequest";
import { SendRequest } from "../SendRequest";
import { LocationDataResponse } from "@/types/CountryData";

export class Request_Location extends SendRequest
{

    public static getCountryList = async (): Promise<CommonReturn<LocationDataResponse[]>> =>
    {

        try
        {
            const url = `${this.serverHost}:${this.serverPort}/location/getcountry`;

            const params = new URLSearchParams();

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during getASN:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }

    }

    public static getSubDivisionByCountry = async (countryID: number): Promise<CommonReturn<LocationDataResponse[]>> =>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/location/getsubdivision`;

            const params = new URLSearchParams();

            params.append('countryID', countryID.toString());

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during getASN:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }

    }

    public static getCityBySubDivisionOrCountry = async (countryID: number, subdivisionID: number): Promise<CommonReturn<LocationDataResponse[]>> =>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/location/getcity`;

            const params = new URLSearchParams();

            params.append('countryID', countryID.toString());
            params.append('subdivisionID', subdivisionID.toString());

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during getASN:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }

    }

    public static getZipCodeByCityID = async (cityID: number): Promise<CommonReturn<LocationDataResponse[]>> =>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/location/getzipcode`;

            const params = new URLSearchParams();

            params.append('cityID', cityID.toString());

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during getASN:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }

    }

}