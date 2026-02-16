const mongoose = require("mongoose");

const clientProfileSchema = new mongoose.Schema({
  // 1. Link to Auth User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser", // Must match your Auth Model Name
    required: true,
    unique: true
  },

  // 2. Company Branding & Basic Info
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: "" // URL to image
  },
  companyBanner: {
    type: String,
    default: "" // URL to background cover
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  companyDescription: {
    type: String,
    maxlength: 1000
  },

  // 3. Industry & Size (Helps Freelancers filter)
  industry: {
    type: String,
    default: "General" // e.g., IT, Marketing, Healthcare
  },
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    default: "1-10"
  },

  // 4. Location Details
  location: {
    city: String,
    country: String,
    address: String, // Optional: for invoicing
    timezone: String // e.g., "GMT+5:30"
  },

  // 5. Social Presence
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },

  // 6. Platform Stats (For Dashboard Analytics)
  stats: {
    totalJobsPosted: { type: Number, default: 0 },
    totalHires: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }, // Total money spent on platform
    activeJobs: { type: Number, default: 0 }
  },

  // 7. Trust & Verification
  isVerified: {
    type: Boolean,
    default: false // Checkmark badge
  },
  rating: {
    type: Number,
    default: 0, // Average rating from Freelancers
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },

  // 8. Contact Info (Public or Private)
  contactEmail: {
    type: String // Separate from login email (e.g., hr@company.com)
  },
  contactPhone: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("ClientProfile", clientProfileSchema);