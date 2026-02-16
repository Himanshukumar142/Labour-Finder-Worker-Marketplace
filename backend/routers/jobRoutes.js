const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware"); // Path check kar lena

const { 
  postJob, 
  getAllJobs, 
  getJobById, 
  getMyJobs 
} = require("../controllers/jobController");

// --- PUBLIC ROUTES (Bina Login ke bhi dekh sakein - Optional) ---
// Agar aap chahte hain ki sirf login user jobs dekhe, to 'protect' laga dein
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// --- PROTECTED ROUTES (Login Zaroori) ---

// Client apna khud ka job post karega
router.post("/", protect, postJob);

// Client apne post kiye hue jobs dekhega
router.get("/client/my-jobs", protect, getMyJobs);

module.exports = router;