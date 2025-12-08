import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Truck, LogOut, List, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface AdminLayoutProps {
    onLogout: () => void;
    role?: string | null;
}

const AdminLayout = ({ onLogout, role }: AdminLayoutProps) => {
    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="font-bold text-xl text-primary">Admin Panel</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                        Dashboard
                    </Link>
                    <Link to="/products" className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Package className="w-5 h-5" />
                        Produtos
                    </Link>
                    <Link to="/vehicles" className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Truck className="w-5 h-5" />
                        Veículos
                    </Link>
                    <Link to="/references" className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <List className="w-5 h-5" />
                        Referências
                    </Link>
                    {role === 'admin' && (
                        <Link to="/users" className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <User className="w-5 h-5" />
                            Usuários
                        </Link>
                    )}
                    {/* Future Links */}
                </nav>
                <div className="p-4 border-t border-gray-200 absolute bottom-0 w-64">
                    <Button variant="outline" className="w-full" onClick={onLogout}>
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
