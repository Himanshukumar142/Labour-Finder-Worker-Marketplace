// backend/models/Contract.js
import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser", 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser", 
    required: true 
  },
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true
  },

  // Paisa kitna tay hua tha
  agreedAmount: { 
    type: Number, 
    required: true 
  },
  
  // Platform apna commission (e.g., 10%) yahan save karega
  platformFee: {
    type: Number,
    default: 0
  },

  // Kaam ka status
  status: {
    type: String,
    enum: ["NEW", "ACTIVE", "SUBMITTED", "COMPLETED", "DISPUTED", "CANCELLED"],
    default: "NEW"
  },

  // Paise ka status (Escrow Tracking)
  paymentStatus: {
    type: String,
    enum: ["PENDING", "FUNDED", "RELEASED", "REFUNDED"],
    default: "PENDING"
  },

  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }

}, { timestamps: true });

export default mongoose.model("Contract", contractSchema);