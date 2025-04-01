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
        return (
            <Router>
                <Toaster richColors position="top-center" />
                <Routes>
                    {/* 访问 /login 时，如果已经登录，重定向到 /dashboard */}
                    <Route
                        path="/login"
                        element={this.state.userData ? <Navigate to="/dashboard" /> : <LoginPage onLogin={this.handleLogin} showMessage={this.showMessage} />}
                    />

                    {/* 受保护的仪表盘页面 */}
                    <Route
                        path="dashboard/*"
                        element={this.state.userData ? <DashBoard onLogout={this.handleLogout} /> : <Navigate to="/login" />}
                    />

                    {/* 任何未知路径都根据 `logged` 状态重定向 */}
                    <Route path="*" element={<Navigate to={this.state.userData ? "/dashboard" : "/login"} />} />
                </Routes>
            </Router>

        );
    }
}