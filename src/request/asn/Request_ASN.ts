import { CommonReturn } from "@/types/SendRequest";
import { SendRequest } from "../SendRequest";
import { ASNData } from "@/types/ASN";

export class Request_ASN extends SendRequest
{

    public static getASN = async (): Promise<CommonReturn<ASNData[]>> =>
    {

        try
        {
            const url = `${this.serverHost}:${this.serverPort}/asn/getasn`;

            const params = new URLSearchParams();

            const headers = new Headers({
                'Content-Type': 'application/json'
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

    public static addASN = async (asn: string): Promise<CommonReturn<ASNData>> =>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/asn/addasn`;

            const params = new URLSearchParams()

            params.append('asn', asn);

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);

            const data = await response.json();

            return data
        } catch (error)
        {
            console.error("Error during addASN:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }
    }

}