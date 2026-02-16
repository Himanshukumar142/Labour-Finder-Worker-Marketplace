import React, { useState } from "react";
import api from "../../utils/api"; // Wahi updated api.js
import { useNavigate, Link } from "react-router-dom";

const FreelancerLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Backend Call: Login Route
      // URL: http://localhost:5000/api/freelance/auth/login
      const res = await api.post("/freelancer/auth/login", formData);

      if (res.data.token) {
        // Token aur Role save karein
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        alert("Login Successful!");

        // Role ke hisaab se sahi Dashboard par bhejein
        if (res.data.user.role === "CLIENT") {
          navigate("/client/dashboard");
        } else {
          navigate("/freelancer/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" name="email" 
              className="w-full p-2 border rounded" 
              onChange={handleChange} required 
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" name="password" 
              className="w-full p-2 border rounded" 
              onChange={handleChange} required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Log In
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          New here? <Link to="/freelancer/signup" className="text-blue-600">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default FreelancerLogin;