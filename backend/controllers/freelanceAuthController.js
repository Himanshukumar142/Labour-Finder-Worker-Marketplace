const AuthUser = require("../models/AuthUser");
const Wallet = require("../models/wallet");
const FreelancerProfile = require("../models/FreelancerProfile");
const ClientProfile = require("../models/ClientProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- GENERATE TOKEN ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- SIGNUP CONTROLLER ---
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2. Check if user exists
    const userExists = await AuthUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await AuthUser.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      // 5. Create Wallet
      const wallet = await Wallet.create({
        userId: user._id,
        balance: 0
      });
      user.wallet = wallet._id;

      // 6. Create Profile based on Role
      if (role === "FREELANCER") {
        const profile = await FreelancerProfile.create({
          userId: user._id,
          skills: [],
          hourlyRate: 0,
          experienceLevel: "BEGINNER"
        });
        user.freelancerProfile = profile._id;
      }
      else if (role === "CLIENT") {
        const profile = await ClientProfile.create({
          userId: user._id,
          companyName: name + "'s Company",
        });
        user.clientProfile = profile._id;
      }

      await user.save(); // Save Links

      // ✅ FIX: Response Structure (User object ke andar wrap kiya)
      res.status(201).json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });

    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// --- LOGIN CONTROLLER ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email); // Debug log

    // Check User
    const user = await AuthUser.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user.name, "- Checking password...");

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordMatch);

    if (isPasswordMatch) {
      console.log("Login successful for:", user.name);

      // ✅ FIX: Response Structure (User object ke andar wrap kiya)
      res.json({
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });

    } else {
      console.log("Password mismatch for user:", user.name);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { signup, login };