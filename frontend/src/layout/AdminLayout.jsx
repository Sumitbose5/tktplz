import { Outlet, useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";
import { Menu, X, LogOut, Settings, Users, LayoutDashboard, Calendar, TrendingUp, UsersRound, MessageSquare, BarChart, Landmark } from "lucide-react";

export const AdminLayout = () => {

    const { user, setUser, setEmailData } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/logout", {
                method: 'GET',
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setUser(null);
                setEmailData("");
                localStorage.removeItem('userCity');
                localStorage.removeItem('userState');
                toast.success("Logged out successfully!")
                navigate("/admin/login");
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            console.log("Error in Logging Out ", err);
            toast.error("Can't Log Out");
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded hover:bg-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <NavLink
                        to="/moderator/adm/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/organizer-management"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <Users className="w-4 h-4" /> Organizer Management
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/event-management"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <Calendar className="w-4 h-4" /> Event Management
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/hall-management"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <Landmark className="w-4 h-4" /> Hall Management
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/financials"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <TrendingUp className="w-4 h-4" /> Financial Summary
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/attendees"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <UsersRound className="w-4 h-4" /> Attendees
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/messages"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <MessageSquare className="w-4 h-4" /> Messages or Support
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/analytics"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <BarChart className="w-4 h-4" /> Analytics
                    </NavLink>
                    <NavLink
                        to="/moderator/adm/others"
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
                        <Settings className="w-4 h-4" /> Other Tools
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-100 text-red-600 w-full">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </nav>

            </div>

            {/* Topbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white shadow sticky top-0 z-30">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded hover:bg-gray-200"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="border px-4 py-2 rounded hover:bg-gray-100 text-sm text-gray-700"
                >
                    Logout
                </button>
            </div>

            {/* Content */}
            <main className="p-6 z-10 relative">
                <Outlet />
            </main>
        </div>
    )
}