import { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/page/login/LoginPage";
import DashBoard from "@/page/dashboard/DashBoard";
import '@/index.css'
import { UserData } from "./types/Auth";
import { toast, Toaster } from "sonner"
import { AuthUtils } from "./tools/AuthUtils";

export type ToastType = "success" | "error" | "info" | "warning";

interface MainState
{
    userData?: UserData | null
}

export class Main extends Component<object, MainState>
{
    state = {
        userData: undefined,
    }

    handleLogin = (userData: UserData) =>
    {
        this.setState({ userData: userData });
    };

    handleLogout = () =>
    {
        this.setState({ userData: null });
        toast.success("Logout successfully!");
    };

    async componentDidMount()
    {
        const userData = await AuthUtils.verifyUser()

        if (userData)
        {
            this.setState({ userData: userData });
        } else
        {
            this.setState({ userData: null });
        }

    }


    showMessage = (message: string, type: ToastType = "success") =>
    {
        const toastTypes: Record<ToastType, (msg: string) => void> = {
            success: toast.success,
            error: toast.error,
            info: toast.info,
            warning: toast.warning,
        };

        const showToast = toastTypes[type] || toast.success; // Default to "success" toast
        showToast(message);
    }

    render()
    {
        const { userData } = this.state;

        return (
            <Router>
                <Toaster richColors position="top-center" />
                <Routes>
                    {/* 如果 userData 是 undefined，允许用户留在 login 或 dashboard */}
                    <Route
                        path="/login"
                        element={
                            userData === null ? (
                                <Navigate to="/login" />
                            ) : (
                                <LoginPage onLogin={this.handleLogin} showMessage={this.showMessage} />
                            )
                        }
                    />
                    <Route
                        path="/dashboard/*"
                        element={
                            userData === null ? (
                                <Navigate to="/login" />
                            ) : (
                                <DashBoard onLogout={this.handleLogout} userData={userData} />
                            )
                        }
                    />

                    {/* 根据 userData 的不同状态进行重定向 */}
                    <Route
                        path="*"
                        element={
                            userData === null ? (
                                <Navigate to="/login" />
                            ) : userData ? (
                                <Navigate to="/dashboard" />
                            ) : null // 当 userData 为 undefined 时，停留在当前页面
                        }
                    />
                </Routes>
            </Router>
        );
    }

}