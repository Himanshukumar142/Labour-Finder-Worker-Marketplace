const mongoose = require("mongoose"); // 1. Change import to require

const jobSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser", 
    required: true 
  },
  
  // Jab client kisi freelancer ko hire karega, toh yahan ID aayegi
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser",
    default: null
  },

  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  budget: { 
    type: Number, 
    required: true 
  },
  skillsRequired: [String], // e.g., ["React", "Node.js"]
  
  category: {
    type: String, // e.g., "Web Development", "Graphic Design"
    required: true
  },

  status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    default: "OPEN"
  },

  deadline: {
    type: Date // Project kab tak complete hona chahiye
  }
}, { timestamps: true });

// 2. Change export default to module.exports
module.exports = mongoose.model("Job", jobSchema);