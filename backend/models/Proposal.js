// backend/models/Proposal.js
import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job",
    required: true
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser",
    required: true
  },

  coverLetter: {
    type: String,
    required: true
  },
  
  bidAmount: {
    type: Number,
    required: true
  },

  // Freelancer batayega ki kaam kitne din mein hoga (e.g., "7 Days")
  estimatedDuration: {
    type: String, 
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true }); // Isse createdAt aur updatedAt auto-add ho jayenge

export default mongoose.model("Proposal", proposalSchema);