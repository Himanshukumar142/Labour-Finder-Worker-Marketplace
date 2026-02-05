const express = require("express");
const router = express.Router();

const { protect } = require("../models/middlewares/authMiddleware");
const restrictTo = require("../models/middlewares/roleMiddleware");

router.get("/agent", protect, restrictTo("agent"), (req, res) => {
  res.json({ msg: "Agent Dashboard" });
});

router.get("/personal", protect, restrictTo("personal"), (req, res) => {
  res.json({ msg: "User Dashboard" });
});

module.exports = router;
