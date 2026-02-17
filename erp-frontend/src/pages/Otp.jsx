import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Otp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate("/");
    }
  }, [navigate]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = localStorage.getItem("email");
      const res = await API.post("/auth/verify-otp", { email, otp });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || "Verification failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const email = localStorage.getItem("email");
      await API.post("/auth/login", { email });
      alert("OTP resent to your email!");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <form onSubmit={verifyOtp}>
      <h2>Enter OTP</h2>
      <p style={{ textAlign: 'center', marginBottom: '15px', color: '#666' }}>
        Check your email for the OTP
      </p>
      
      <input
        type="text"
        placeholder="6 digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      
      <button 
        type="button" 
        onClick={resendOtp}
        style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
      >
        Resend OTP
      </button>
    </form>
  );
}

export default Otp;
