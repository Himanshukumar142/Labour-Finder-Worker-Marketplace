const mongoose = require("mongoose");

const workerOtpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 min
  }
});

module.exports = mongoose.model("WorkerOtp", workerOtpSchema);
