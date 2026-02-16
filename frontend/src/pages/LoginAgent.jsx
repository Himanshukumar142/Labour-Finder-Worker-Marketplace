import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        form
      );

      // ✅ Save JWT
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      alert("Login successful");

      // ✅ Role based redirect
      if (res.data.user.role === "agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/personal/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-[#F2E6EE] via-[#FFCCF2] to-[#977DFF]">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#977DFF] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0033FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#FFCCF2] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#977DFF] to-[#0033FF] mb-4 animate-pulse-slow">
            <span className="text-3xl text-white font-bold">L</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0600AF] via-[#0033FF] to-[#977DFF] bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          <div className="relative group">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-[#977DFF] focus:outline-none transition-all duration-300 peer placeholder-transparent"
            />
            <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-[#977DFF] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#977DFF]">
              Phone Number
            </label>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#977DFF] to-[#0033FF] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
          </div>

          <div className="relative group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-[#977DFF] focus:outline-none transition-all duration-300 peer placeholder-transparent"
            />
            <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-[#977DFF] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#977DFF]">
              Password
            </label>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#977DFF] to-[#0033FF] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full mt-8 bg-gradient-to-r from-[#0600AF] via-[#0033FF] to-[#977DFF] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span className="relative z-10">
            {isLoading ? "Signing In..." : "Sign In"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#977DFF] to-[#0033FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <a href="#" className="text-sm text-[#0033FF] hover:text-[#977DFF] transition-colors duration-300">
            Forgot password?
          </a>
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="text-[#0033FF] hover:text-[#977DFF] font-semibold transition-colors duration-300">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}