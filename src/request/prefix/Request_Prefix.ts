import { CommonReturn } from "@/types/SendRequest";
import { SendRequest } from "../SendRequest";
import { PrefixData } from "@/types/Prefix";

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

}