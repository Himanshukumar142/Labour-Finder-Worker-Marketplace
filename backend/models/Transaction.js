// backend/models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"], // Paisa aaya ya gaya
    required: true
  },
  category: {
    type: String,
    enum: ["DEPOSIT", "WITHDRAWAL", "JOB_PAYMENT", "REFUND", "ESCROW_RELEASE"], // Transaction kis wajah se hua
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"], // Payment gateway status track karne ke liye
    default: "PENDING"
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job" // Optional: Agar payment kisi job ke liye hai toh yahan link hoga
  },
  paymentGatewayId: {
    type: String // Stripe/Razorpay ki Transaction ID store karne ke liye
  },
  description: {
    type: String // User ko history dikhane ke liye (e.g., "Payment for Job: Web Design")
  }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);