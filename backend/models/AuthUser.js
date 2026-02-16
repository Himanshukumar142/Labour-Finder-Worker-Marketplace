const mongoose = require("mongoose"); // 1. Changed import to require

const authUserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["CLIENT", "FREELANCER", "ADMIN"],
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  profileCompleted: { 
    type: Boolean, 
    default: false 
  },

  // --- NEW ARCHITECTURE CHANGES ---
  
  // Wallet se connect karne ke liye
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet"
  },

  // Agar user freelancer hai, toh uska detail profile yahan link hoga
  freelancerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FreelancerProfile"
  },

  // Agar user client hai, toh company details yahan link hongi
  clientProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientProfile"
  }

}, { timestamps: true });

// 2. Changed export default to module.exports
module.exports = mongoose.model("AuthUser", authUserSchema);