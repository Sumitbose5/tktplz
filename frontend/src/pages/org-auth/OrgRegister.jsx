import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";

export const OrganiserRegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNo: "",
    });
    const { setEmailData } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { name, email, phoneNo } = formData;

        if (!name || !email.includes("@") || phoneNo.length < 10) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/auth/orgn-reg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setEmailData(email);
                navigate("/org-verify-otp")
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log("Registration Error:", err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Part */}
            <div className="w-1/2 bg-gradient-to-br from-blue-700 to-orange-500 text-white flex flex-col justify-center items-center p-10">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 text-white hover:text-gray-200 transition-colors cursor-pointer"
                >
                    <FaArrowLeft size={20} />
                </button>

                <h1 className="text-4xl font-bold mb-4">Join as Organiser!</h1>
                <p className="text-lg text-center max-w-md">
                    Create, promote, and manage your events effortlessly with <span className="font-semibold">TktPlz</span>. Start building your event empire today!
                </p>
            </div>

            {/* Right Part */}
            <div className="w-1/2 flex items-center justify-center p-10">
                <form
                    onSubmit={handleRegister}
                    className="w-full max-w-md space-y-6 bg-white p-8 shadow-xl rounded-2xl border"
                >
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Organiser Registration</h2>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-600">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNo"
                            name="phoneNo"
                            className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 text-white rounded-lg font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            } transition-all duration-200`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <NavLink to="/org-login" className="text-blue-600 hover:underline">
                            Login
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
};
