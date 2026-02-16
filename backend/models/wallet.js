const mongoose = require("mongoose"); // 1. Change import to require

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser", // User model se connect kiya
    required: true,
    unique: true // Ek user ka ek hi wallet hoga
  },
  balance: { 
    type: Number, 
    default: 0 // Available balance (jo withdraw kar sakte hain)
  },
  escrowBalance: {
    type: Number,
    default: 0 // Wo paisa jo "Hold" par hai (Job complete hone tak)
  },
  currency: {
    type: String,
    default: "INR" // Default currency
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction" // Transaction history ka reference
  }]
}, { timestamps: true });

// 2. Change export default to module.exports
module.exports = mongoose.model("Wallet", walletSchema);