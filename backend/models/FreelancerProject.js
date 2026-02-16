const mongoose = require("mongoose");

const FreelancerProjectSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FreelancerProfile"
  },

  title: String,
  description: String,
  technologies: [String],
  images: [String],
  projectLink: String
}, { timestamps: true });

module.exports = mongoose.model("FreelancerProject", FreelancerProjectSchema);
