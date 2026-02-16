const mongoose = require("mongoose"); // 1. Change import to require

const freelancerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AuthUser" // Ensure this matches your AuthUser model name
  },

  profileImage: String,
  title: String,
  bio: String,

  skills: [String],
  hourlyRate: Number,
  experienceLevel: {
    type: String,
    enum: ["BEGINNER", "INTERMEDIATE", "EXPERT"]
  },

  location: {
    country: String,
    city: String
  },

  badges: [String], // Top Rated, Rising Talent etc

  verification: {
    idVerified: Boolean,
    emailVerified: Boolean
  },

  socialLinks: {
    github: String,
    linkedin: String,
    portfolio: String
  },

  workHistory: [
    {
      jobTitle: String,
      clientName: String,
      rating: Number,
      amountEarned: Number,
      completedAt: Date
    }
  ],

  projects: [
    {
      title: String,
      description: String,
      link: String
    }
  ],

  totalEarnings: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 }

}, { timestamps: true });

// 2. Change export default to module.exports
module.exports = mongoose.model("FreelancerProfile", freelancerSchema);