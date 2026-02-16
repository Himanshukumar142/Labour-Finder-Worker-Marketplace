const FreelancerProfile = require("../models/FreelancerProfile");
const AuthUser = require("../models/AuthUser");
const jwt = require("jsonwebtoken"); // ✅ JWT Import zaroori hai

// --- HELPER: Token Verify karne ke liye (Bina Middleware ke) ---
const verifyUser = async (req) => {
  try {
    let token;
    // 1. Header se token nikalo
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return null;

    // 2. Token decode karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. User dhoondo
    return await AuthUser.findById(decoded.id).select("-password");
  } catch (error) {
    return null;
  }
};

// --- 1. GET CURRENT PROFILE ---
const getFreelancerProfile = async (req, res) => {
  try {
    // The protect middleware already sets req.user
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please login." });
    }

    console.log("Fetching profile for user:", req.user._id); // Debug log

    // Fetch Profile using req.user._id (from protect middleware)
    const profile = await FreelancerProfile.findOne({ userId: req.user._id })
      .populate("userId", "name email role");

    console.log("Profile found:", profile); // Debug log

    // If no FreelancerProfile exists, return basic AuthUser data
    if (!profile) {
      console.log("No FreelancerProfile found, returning AuthUser data");

      // req.user already has the basic info from protect middleware
      return res.json({
        userId: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        },
        title: null,
        bio: null,
        skills: [],
        hourlyRate: null,
        experienceLevel: null,
        profileImage: null,
        location: {},
        socialLinks: {},
        projects: []
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error in getFreelancerProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 2. CREATE OR UPDATE PROFILE ---
const createOrUpdateProfile = async (req, res) => {
  try {
    // The protect middleware already sets req.user
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please login." });
    }

    const {
      title,
      bio,
      skills,
      hourlyRate,
      experienceLevel,
      location,
      socialLinks,
      projects,
      profileImage
    } = req.body;

    // Build profile object
    const profileFields = {
      userId: req.user._id, // Use req.user from protect middleware
      title,
      bio,
      hourlyRate,
      experienceLevel,
      profileImage,
      location: location || {},
      socialLinks: socialLinks || {},
      projects: projects || []
    };

    // Skills handling
    if (skills) {
      profileFields.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim());
    }

    // Check if profile exists
    let profile = await FreelancerProfile.findOne({ userId: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await FreelancerProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { new: true }
      ).populate("userId", "name email");
      return res.json(profile);
    }

    // Create new profile
    profile = new FreelancerProfile(profileFields);
    await profile.save();

    // Populate userId before sending response
    profile = await FreelancerProfile.findById(profile._id)
      .populate("userId", "name email");

    // Link profile to AuthUser
    await AuthUser.findByIdAndUpdate(req.user._id, { freelancerProfile: profile._id });

    res.json(profile);

  } catch (error) {
    console.error("Error in createOrUpdateProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getFreelancerProfile, createOrUpdateProfile };
