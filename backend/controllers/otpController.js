const Otp = require("../models/Otp");

// Generate OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5*60*1000); // 5 min

    await Otp.create({ phone, otp: otpCode, expiresAt });

    console.log(`OTP for ${phone}: ${otpCode}`); // For testing
    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Verify OTP
exports.verifyOtp = async (phone, otp) => {
  const otpRecord = await Otp.findOne({ phone, otp, isUsed: false });
  if (!otpRecord) throw new Error("Invalid OTP");
  if (otpRecord.expiresAt < new Date()) throw new Error("OTP expired");

  otpRecord.isUsed = true;
  await otpRecord.save();
  return true;
};
