import { useEffect, useRef } from "react";
import { useModal } from "../../context/ModalContext";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiBell, FiUser, FiBookOpen, FiLogOut, FiChevronRight, FiSettings, FiHelpCircle, FiGift } from "react-icons/fi";

export const Sidebar = () => {
    const { isSidebarOpen, setSidebarOpen } = useModal();
    const sidebarRef = useRef(null);
    const { user, setUser, setEmailData } = useAuth();

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false);
            }
        };
        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen, setSidebarOpen]);

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
                setSidebarOpen(false);
                localStorage.removeItem('userCity');
                localStorage.removeItem('userState');
                toast.success("Logged out successfully!")
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log("Error in Logging Out ", err);
            alert("Can't Log Out");
        }
    };

    return (
        <>
            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-90 bg-white z-[100] shadow-2xl flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* User/Profile Section */}
                <div className="flex flex-col items-center justify-center py-8 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-2">
                        {user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : "U")}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">{user?.name || "Hey!"}</div>
                    <div className="text-xs text-blue-500 cursor-pointer hover:underline">Edit Profile</div>
                </div>
                {/* Menu */}
                <nav className="flex-1 overflow-y-auto">
                    <ul className="py-2 divide-y divide-gray-100">
                        <li>
                            <NavLink to="/notifications" className="flex items-center px-6 py-4 hover:bg-gray-50 transition group">
                                <FiBell className="text-xl text-blue-500 mr-4" />
                                <span className="flex-1 text-gray-800">Notifications</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-blue-500" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/bookings" className="flex items-center px-6 py-4 hover:bg-gray-50 transition group">
                                <FiBookOpen className="text-xl text-blue-500 mr-4" />
                                <span className="flex-1 text-gray-800">Your Orders</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-blue-500" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className="flex items-center px-6 py-4 hover:bg-gray-50 transition group">
                                <FiUser className="text-xl text-blue-500 mr-4" />
                                <span className="flex-1 text-gray-800">Account & Settings</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-blue-500" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/help" className="flex items-center px-6 py-4 hover:bg-gray-50 transition group">
                                <FiHelpCircle className="text-xl text-blue-500 mr-4" />
                                <span className="flex-1 text-gray-800">Help & Support</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-blue-500" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/rewards" className="flex items-center px-6 py-4 hover:bg-gray-50 transition group">
                                <FiGift className="text-xl text-blue-500 mr-4" />
                                <span className="flex-1 text-gray-800">Rewards</span>
                                <FiChevronRight className="text-gray-400 group-hover:text-blue-500" />
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                {/* Sign Out Button */}
                {user && (
                    <div className="p-6 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition text-lg"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

