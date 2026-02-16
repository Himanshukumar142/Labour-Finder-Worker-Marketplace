const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware");
const { getWallet, addFunds, withdrawFunds } = require("../controllers/walletController");

router.get("/", protect, getWallet);
router.post("/add", protect, addFunds);
router.post("/withdraw", protect, withdrawFunds);

module.exports = router;
