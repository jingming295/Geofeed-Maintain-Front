import { Auth } from "@/request/auth/Auth";
import { UserData } from "@/types/Auth";

export class AuthUtils
{

    public static saveUserData(userData: UserData): void
    {
        localStorage.setItem("UserData", JSON.stringify(userData));
    }

    public static getUserData(): UserData | null
    {
        const userData = localStorage.getItem("UserData");
        return userData ? JSON.parse(userData) : null;
    }

    public static async verifyUser()
    {
        const userDataFromStorage = this.getUserData();

        if (!userDataFromStorage)
        {
            return null;
        }

        const response = await Auth.verifyUser()

        if (response.code === 0)
        {
            if (response.data)
            {
                this.saveUserData(response.data);
                return response.data
            }
        }
        return null
    }

}
