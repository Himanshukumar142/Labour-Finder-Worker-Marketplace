const mongoose = require("mongoose");

const clientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser", // CHANGE THIS from "User" to "AuthUser"
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyWebsite: {
    type: String
  },
  companyDescription: {
    type: String
  },
  location: {
    city: String,
    country: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  },
  // Jobs Posted count rakhna ho to
  totalJobsPosted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("ClientProfile", clientProfileSchema);