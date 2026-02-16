const express = require("express");
const router = express.Router();

// Controller Import
// Ensure karein ki aapka controller file yahin par hai: backend/controllers/freelanceAuthController.js
const { signup, login } = require("../controllers/freelanceAuthController");

// --- ROUTES ---

// 1. Signup Route
// Method: POST
// URL: /api/auth/signup
// Kaam: Naya user banata hai, Wallet create karta hai, aur Profile setup karta hai.
router.post("/signup", signup);

// 2. Login Route
// Method: POST
// URL: /api/auth/login
// Kaam: Email/Password check karke Token wapas karta hai.
router.post("/login", login);

module.exports = router;