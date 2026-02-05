const User = require("../models/CreatorModel");
const Otp = require("../models/OtpModel");
const bcrypt = require("bcrypt"); // ✅ use bcrypt
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// 1️⃣ Send OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ phone, otp: otpCode });

    console.log(`OTP for ${phone}: ${otpCode}`); // For testing
    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 2️⃣ Verify OTP & Register
exports.verifyOtpAndRegister = async (req, res) => {
  const { name, phone, password, role, otp, shopName } = req.body;
  try {
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) return res.status(400).json({ msg: "Invalid OTP or expired" });

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ msg: "Phone already registered" });

    const user = new User({
      name,
      phone,
      password,
      role,
      shopName,
      isVerified: true
    });

    await user.save(); // Pre-save hook hashes password

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ msg: "Registered successfully", token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 3️⃣ Login
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone }).select("+password");
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.isVerified) return res.status(400).json({ msg: "User not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
