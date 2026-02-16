import React, { useState } from "react";
import api from "../../utils/api"; // Aapka updated api.js
import { useNavigate, Link } from "react-router-dom";

const FreelancerSignup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FREELANCER", // Default role
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Backend Call: Naya wala route use kar rahe hain
      const res = await api.post("/freelancer/auth/signup", formData);

      if (res.data.token) {
        // Token aur Role save karein
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        alert("Account Created Successfully!");
        
        // Role ke hisaab se redirect (Abhi Dashboard nahi hai to Home bhejt hain)
        if (res.data.user.role === "CLIENT") {
            navigate("/client/dashboard");
        } else {
            navigate("/freelancer/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Labour Finder</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input 
              type="text" name="name" 
              className="w-full p-2 border rounded" 
              placeholder="Enter your name"
              onChange={handleChange} required 
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" name="email" 
              className="w-full p-2 border rounded" 
              placeholder="Enter your email"
              onChange={handleChange} required 
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" name="password" 
              className="w-full p-2 border rounded" 
              placeholder="Create a password"
              onChange={handleChange} required 
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">I want to:</label>
            <select 
              name="role" 
              className="w-full p-2 border rounded bg-white"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="FREELANCER">Work as a Freelancer</option>
              <option value="CLIENT">Hire Talent (Client)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/freelancer/login" className="text-blue-600">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default FreelancerSignup;