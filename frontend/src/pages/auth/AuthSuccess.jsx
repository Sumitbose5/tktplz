import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { TktPlzSpinner } from "../../components/Other/Spinner";

export const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [GoogleLoginLoading, setGoogleLoginLoading] = useState(true);
  const hasRun = useRef(false); // To prevent multiple executions

  useEffect(() => {
    // Run only once
    if (hasRun.current) return;
    hasRun.current = true;

    const verifyGoogleLogin = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          toast.success("Logged in successfully with Google 🎉");
          navigate("/");
        } else {
          toast.error("Login failed. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        navigate("/");
      } finally {
        setGoogleLoginLoading(false);
      }
    };

    verifyGoogleLogin();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {GoogleLoginLoading ? (
        <TktPlzSpinner />
      ) : (
        <p className="text-gray-600">Redirecting...</p>
      )}
    </div>
  );
};
