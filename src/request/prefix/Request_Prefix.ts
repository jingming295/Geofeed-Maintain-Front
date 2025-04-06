/* eslint-disable @typescript-eslint/no-unused-expressions */
import { CommonReturn } from "@/types/SendRequest";
import { SendRequest } from "../SendRequest";
import { PrefixData, UpdatePrefixData } from "@/types/Prefix";

export class Request_Prefix extends SendRequest
{

    public static getPrefix = async (asn: string): Promise<CommonReturn<PrefixData[]>> =>
    {

        try
        {
            const url = `${this.serverHost}:${this.serverPort}/prefix/getprefix`;

            const params = new URLSearchParams();

            params.append('asn', asn);

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

    public static getPrefixById = async (id: number): Promise<CommonReturn<PrefixData>> =>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/prefix/getprefixbyid`;

            const params = new URLSearchParams();

            params.append('id', id.toString());

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during getPrefixById:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }
    }

    public static updatePrefixLocation = async (id: number, proxyData: UpdatePrefixData): Promise<CommonReturn<PrefixData>> =>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/location/updateprefixlocation`;

            const params = new URLSearchParams();

            params.append('id', id.toString());
            proxyData.countryid && params.append('countryid', proxyData.countryid.toString());
            proxyData.subdivisionsid && params.append('subdivisionsid', proxyData.subdivisionsid.toString());
            proxyData.city.id && params.append('cityid', proxyData.city.id.toString());
            proxyData.city.name && params.append('cityname', proxyData.city.name.toString());
            proxyData.zipCode.id && params.append('zipcodeid', proxyData.zipCode.id.toString());
            proxyData.zipCode.name && params.append('zipcodename', proxyData.zipCode.name.toString());

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during updatePrefixLocation:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }
    }

}