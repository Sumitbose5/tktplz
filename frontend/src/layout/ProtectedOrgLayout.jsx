import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChartLine, FaSignOutAlt, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";

export const ProtectedOrganiserLayout = () => {
    const { user, setUser, setEmailData } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logout = async () => {
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
                navigate("/org-login");
                toast.success("Logged out successfully!")
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            console.log("Error in Logging Out ", err);
            toast.error("Can't Log Out");
        }
    };


    const handleClick = () => {
        navigate("/organiser/create-event");
    }

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 font-inter">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-52 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-blue-700 tracking-tight">TktPlz Organiser</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="hover:bg-gray-100 p-2 rounded transition"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <nav className="flex flex-col gap-3 px-3 py-7">
                    <NavLink
                        to="/organiser/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            }`
                        }
                    >
                        <FaHome className="w-4 h-4" /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/organiser/events"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            }`
                        }
                    >
                        <FaCalendarAlt className="w-4 h-4" /> My Events
                    </NavLink>
                    <NavLink
                        to="/organiser/analytics"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            }`
                        }
                    >
                        <FaChartLine className="w-4 h-4" /> Analytics
                    </NavLink>
                    <div className="mt-8" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <FaSignOutAlt className="w-4 h-4" /> Logout
                    </button>
                </nav>
            </div>

            {/* --------------------------------------- */}

            {/* Top Bar */}
            <header className="flex justify-between items-center px-6 py-4 bg-white shadow sticky top-0 z-30">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded hover:bg-gray-200 cursor-pointer"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 ml-25">Welcome, {user?.name || "Organiser"} 👋</h1>
                <button
                    onClick={handleClick}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A73E8] text-white font-semibold rounded-2xl shadow-md hover:bg-[#1664c1] transition-all duration-200 cursor-pointer"
                >
                    <span className="text-lg font-bold">+</span> Create Event
                </button>
            </header>

            {/* Content */}
            <main className="p-6 z-10 relative">
                <Outlet />
            </main>
        </div>
    );
};
