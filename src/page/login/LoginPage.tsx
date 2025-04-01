import { ToastType } from "@/App";
import { LoginForm } from "@/components/login-form";
import { UserData } from "@/types/Auth";
import { Component, ReactNode } from "react";

interface LoginPageProps
{

    onLogin: (userData: UserData) => void
    showMessage(message: string, type?: ToastType): void
}

export class LoginPage extends Component<LoginPageProps>
{

    render(): ReactNode
    {
        const { showMessage, onLogin } = this.props;
        return (
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm
                        showMessage={showMessage}
                        onLogin={onLogin}
                    />
                </div>
            </div>
        )

    }
}