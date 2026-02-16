const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware");

// Ensure ye path ab sahi kaam karega kyunki file ban gayi hai
const { 
  createOrUpdateClientProfile, 
  getClientProfile 
} = require("../controllers/clientProfileController"); 

router.get("/me", protect, getClientProfile);
router.post("/", protect, createOrUpdateClientProfile);

module.exports = router;