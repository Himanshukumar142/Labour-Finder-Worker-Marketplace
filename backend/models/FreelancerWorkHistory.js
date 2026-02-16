const mongoose = require("mongoose");

const FreelancerWorkHistorySchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FreelancerProfile"
  },

  clientName: String,
  jobTitle: String,
  description: String,
  budget: Number,
  completedAt: Date
});

module.exports = mongoose.model("FreelancerWorkHistory", FreelancerWorkHistorySchema);
