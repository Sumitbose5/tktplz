import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const OrganiserLoginPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { setEmailData, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            toast.error("Enter a valid email!");
            return;
        }
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/auth/orgn-login", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }), // Sending email
            })

            const data = await response.json();

            if (response.ok) {
                setTimeout(() => { // Optional delay for better UI experience
                    setLoading(false);
                    setEmailData(email);
                    setUser(data.userData);
                    navigate("/org-verify-otp");
                }, 2000);

            } else {
                setLoading(false);
                toast.error(data.message); // Show error message
            }

        } catch (err) {
            console.log("Login Error ", err);
            setLoading(false);
            toast.error("Something went wrong!")
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Part */}
            <div className="w-1/2 bg-gradient-to-br from-blue-700 to-orange-500 text-white relative p-10 flex flex-col justify-center items-center">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 text-white hover:text-gray-200 transition-colors cursor-pointer"
                >
                    <FaArrowLeft size={20} />
                </button>

                <h1 className="text-4xl font-bold mb-4 mt-10">Welcome Organiser!</h1>
                <p className="text-lg text-center max-w-md">
                    Manage your events, track ticket sales, and create amazing experiences with <span className="font-semibold">TktPlz</span>. Your journey to powerful event hosting starts here.
                </p>
            </div>


            {/* Right Part */}
            <div className="w-1/2 flex items-center justify-center p-10">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-md space-y-6 bg-white p-8 shadow-xl rounded-2xl border"
                >
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Organiser Login</h2>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 text-white rounded-lg font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            } transition-all duration-200`}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}

                        <NavLink className="text-blue-600 hover:underline cursor-pointer"
                            to="/org-register">
                            Register
                        </NavLink>

                    </p>
                </form>
            </div>
        </div>
    );
}
