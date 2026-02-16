const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware"); // Path check kar lena

const {
  createProposal,
  getProposalsByJob,
  updateProposalStatus,
  getMyProposals
} = require("../controllers/proposalController");

// --- ROUTES ---

// 1. Submit Proposal (Freelancer Only)
// POST /api/proposals
router.post("/", protect, createProposal);

// 1.b Get My Proposals (Freelancer Only)
// GET /api/proposals/my-proposals
router.get("/my-proposals", protect, getMyProposals);

// 2. Get Proposals for a Job (Client Only)
// GET /api/proposals/job/:jobId
router.get("/job/:jobId", protect, getProposalsByJob);

// 3. Accept/Reject Proposal (Client Only)
// PUT /api/proposals/:id
router.put("/:id", protect, updateProposalStatus);

module.exports = router;