const ClientProfile = require("../models/ClientProfile"); // Model check karlena
const AuthUser = require("../models/AuthUser");

// --- 1. GET CLIENT PROFILE ---
const getClientProfile = async (req, res) => {
  try {
    const profile = await ClientProfile.findOne({ userId: req.user.id })
      .populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 2. CREATE OR UPDATE PROFILE ---
const createOrUpdateClientProfile = async (req, res) => {
  try {
    const { 
      companyName, 
      companyWebsite, 
      companyDescription, 
      location, 
      socialLinks // Object: { linkedin, twitter }
    } = req.body;

    const profileFields = {
      userId: req.user.id,
      companyName,
      companyWebsite,
      companyDescription,
      location,
      socialLinks: socialLinks || {}
    };

    // Check if profile exists
    let profile = await ClientProfile.findOne({ userId: req.user.id });

    if (profile) {
      // Update
      profile = await ClientProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Create
      profile = new ClientProfile(profileFields);
      await profile.save();

      // Link to AuthUser
      await AuthUser.findByIdAndUpdate(req.user.id, { clientProfile: profile._id });
    }

    res.json(profile);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getClientProfile, createOrUpdateClientProfile };