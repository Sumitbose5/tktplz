import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import QRCode from 'react-qr-code'

export const InviteQRPage = () => {
    const { email, token } = useParams();
    const decodedEmail = decodeURIComponent(email);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const navigate = useNavigate();

    const cachedQrUrl = localStorage.getItem("qrCodeUrl");

    useEffect(() => {
        const markVisitAndFetchQRCode = async () => {
            try {
                await axios.post("http://localhost:3000/api/auth/admin/markInviteVisited", {
                    email: decodedEmail,
                    token
                });

                const res = await axios.get(
                    `http://localhost:3000/api/auth/admin/invite/${decodedEmail}`
                );

                setQrCodeUrl(res.data.qrUrl);
                localStorage.setItem("qrCodeUrl", res.data.qrUrl);
            } catch (err) {
                toast.error(err?.response?.data?.message || "Something went wrong");
            }
        };

        if (!cachedQrUrl) {
            markVisitAndFetchQRCode();
        } else {
            setQrCodeUrl(cachedQrUrl);
        }
    }, [decodedEmail]);


    const handleProceed = () => {
        // remove qrURL from localStorage
        localStorage.removeItem('qrCodeUrl');
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <div className="bg-gray-100 p-6 rounded-2xl shadow-lg text-center max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Scan QR to Set Up 2FA</h2>

                {qrCodeUrl ? (
                    // <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto mb-6" />
                    <div className="mx-auto mb-6 bg-white p-2 rounded flex justify-center">
                        <QRCode value={qrCodeUrl} size={180} />
                    </div>
                ) : (
                    <p className="text-gray-500 mb-6">Loading QR code...</p>
                )}

                <p className="text-sm text-gray-600 mb-4">
                    Scan the QR code using Google Authenticator or any 2FA app. After that, click "Proceed" to login.
                </p>

                <button
                    onClick={handleProceed}
                    className="bg-[#1A73E8] text-white font-medium px-6 py-2 rounded-xl hover:bg-[#1558c0] transition"
                >
                    Proceed
                </button>
            </div>
        </div>
    );
}
