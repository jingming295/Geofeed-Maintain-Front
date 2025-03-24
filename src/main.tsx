import { Component, StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./page/login/LoginPage";
import { DashBoard } from "./page/dashboard/DashBoard";
import { createRoot } from "react-dom/client";
import '@/index.css'

interface MainState
{
  logged: boolean;
}

class Main extends Component<object, MainState>
{
  state = {
    logged: true
  }

  handleLogin = () =>
  {
    localStorage.setItem("logged", "true");
    this.setState({ logged: true });
  };

  handleLogout = () =>
  {
    localStorage.removeItem("logged");
    this.setState({ logged: false });
  };

  render()
  {
    return (
      <Router>
        <Routes>
          {/* 访问 /login 时，如果已经登录，重定向到 /dashboard */}
          <Route
            path="/login"
            element={this.state.logged ? <Navigate to="/dashboard" /> : <LoginPage onLogin={this.handleLogin} />}
          />

          {/* 受保护的仪表盘页面 */}
          <Route
            path="/dashboard"
            element={this.state.logged ? <DashBoard onLogout={this.handleLogout} /> : <Navigate to="/login" />}
          />

          {/* 任何未知路径都根据 `logged` 状态重定向 */}
          <Route path="*" element={<Navigate to={this.state.logged ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
