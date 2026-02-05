const WorkerOtp = require("../models/WorkerOtp");

exports.sendWorkerOtp = async (req, res) => {
  if (!["agent", "personal"].includes(req.user.role)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await WorkerOtp.deleteMany({ phone });

  await WorkerOtp.create({ phone, otp });

  console.log("Worker OTP:", otp);

  res.json({ message: "OTP sent" });
};

exports.verifyWorkerOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const record = await WorkerOtp.findOne({ phone, otp });
  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  record.verified = true;
  await record.save();

  res.json({ verified: true });
};
