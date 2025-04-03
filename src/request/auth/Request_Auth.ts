import { UserData } from "@/types/Auth";
import { SendRequest } from "../SendRequest";
import { CommonReturn } from "@/types/SendRequest";
import { CryptoUtils } from "@/tools/CryptoUtils";

export class Request_Auth extends SendRequest
{

    public static async login(email: string, password: string): Promise<CommonReturn<UserData>>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/auth/login`;
            const params = new URLSearchParams();

            const hashedPassword = await CryptoUtils.toSHA256(password);

            params.append('email', email);
            params.append('password', hashedPassword);

            const headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const response = await this.sendPost(url, params, headers);
            return await response.json() as CommonReturn<UserData>;
        } catch (error)
        {
            console.error("Error during login:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }

    }

    public static async verifyUser(): Promise<CommonReturn<UserData>>
    {
        try
        {
            const url = `${this.serverHost}:${this.serverPort}/auth/verifyuser`;
            const params = new URLSearchParams();
            const headers = new Headers({
                'Content-Type': 'application/json'
            });

            const response = await this.sendPost(url, params, headers);
            return await response.json() as CommonReturn<UserData>;
        } catch (error)
        {
            console.error("Error during user verification:", error);
            return {
                code: -110,
                message: "Internal Server Error",
                data: undefined
            };
        }
    }

}