import { LoginForm } from "@/components/login-form";
import { Component, ReactNode } from "react";

interface LoginPageProps
{

    onLogin: () => void
}

export class LoginPage extends Component<LoginPageProps>
{

    render(): ReactNode
    {

        return (
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        )

    }
}