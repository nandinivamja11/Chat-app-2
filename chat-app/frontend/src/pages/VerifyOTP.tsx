import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail");

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify", {email, otp,});

      alert(res.data.message);

      // ✅ IMPORTANT: mark user verified
      localStorage.setItem("isVerified", "true");

      // cleanup
      localStorage.removeItem("verifyEmail");

      // go to chat
      navigate("/chat");

    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post("/auth/resend-otp", {
        email,
      });

      alert(res.data.message);

    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6">
          Verify Email</h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"/>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          className="w-full mt-3 text-blue-600 hover:underline">
          Resend OTP
        </button>

      </div>
    </div>
  );
}

export default VerifyOTP;