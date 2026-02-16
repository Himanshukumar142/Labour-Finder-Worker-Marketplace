const express = require("express");
const router = express.Router();

// Middleware Import (Login check karne ke liye)
// Note: Apna path check karein (../middlewares/authMiddleware ya ../models/middlewares/authMiddleware)
const { protect } = require("../models/middlewares/authMiddleware"); 

// Controller Import
const { 
  createOrUpdateProfile, 
  getFreelancerProfile 
} = require("../controllers/freelancerProfileController");

// --- ROUTES ---

// Get My Profile: Login user ka profile layega
// GET /api/freelancer/me
router.get("/me", protect, getFreelancerProfile);

// Update Profile: Skills, Rate, Bio save karega
// POST /api/freelancer/
router.post("/", protect, createOrUpdateProfile);

module.exports = router;