import React, { useState } from "react";
import api from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "agent",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 SEND OTP
  const sendOtp = async () => {
    if (!form.phone) return alert("Phone number required");

    try {
      setLoading(true);
      const res = await api.post(
        "/auth/send-otp",
        { phone: form.phone }
      );

      alert(res.data.msg || "OTP sent");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VERIFY OTP + REGISTER
  const verifyOtpAndRegister = async () => {
    if (!form.otp) return alert("OTP required");

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/verify-otp-register",
        {
          name: form.name,
          phone: form.phone,
          password: form.password,
          role: form.role,
          otp: form.otp,
          shopName: "Personal / Social Worker",
        }
      );

      alert(res.data.msg || "Registration successful");

      // optional: save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="agent">Agent</option>
        <option value="personal">Personal</option>
      </select>

      {!otpSent ? (
        <button onClick={sendOtp} disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      ) : (
        <>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
          />

          <button onClick={verifyOtpAndRegister} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </>
      )}

      <p style={{ marginTop: "10px" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;

// 🔹 basic inline styles
const styles = {
  container: {
    maxWidth: "350px",
    margin: "60px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};
