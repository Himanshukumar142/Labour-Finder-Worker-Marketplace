const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware");

const { 
  createContract, 
  fundContract, 
  releasePayment 
} = require("../controllers/contractController");

// --- ROUTES ---

// 1. Create Contract (Jab Client Hire karta hai)
// POST /api/contracts/create
router.post("/create", protect, createContract);

// 2. Fund Contract (Client paisa lock karta hai)
// POST /api/contracts/fund
router.post("/fund", protect, fundContract);

// 3. Release Payment (Kaam hone par paisa Freelancer ko)
// POST /api/contracts/release
router.post("/release", protect, releasePayment);

module.exports = router;