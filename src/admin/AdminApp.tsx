import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/app/components/ui/sonner";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Vehicles from "./pages/Vehicles";
import VehicleForm from "./pages/VehicleForm";
import References from "./pages/References";
import ReferenceForm from "./pages/ReferenceForm";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";

const queryClient = new QueryClient();

const Dashboard = () => <div className="p-4"><h1>Dashboard</h1><p>Bem-vindo ao sistema administrativo.</p></div>;

const AdminApp = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

    const handleLogin = (newToken: string, newRole: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        setToken(newToken);
        setRole(newRole);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename="/admin">
                <Routes>
                    <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
                    <Route path="/" element={token ? <AdminLayout onLogout={handleLogout} role={role} /> : <Navigate to="/login" />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/new" element={<ProductForm />} />
                        <Route path="/products/:id/edit" element={<ProductForm />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/vehicles/new" element={<VehicleForm />} />
                        <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
                        <Route path="/references" element={<References />} />
                        <Route path="/references/new" element={<ReferenceForm />} />
                        <Route path="/references/:id/edit" element={<ReferenceForm />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/new" element={<UserForm />} />
                        <Route path="/users/:id/edit" element={<UserForm />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Toaster />
        </QueryClientProvider>
    );
};

export default AdminApp;
