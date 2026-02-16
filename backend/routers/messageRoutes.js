const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware"); // Login check
const { sendMessage, getMessages } = require("../controllers/messageController");

// --- ROUTES ---

// 1. Get Chat History
// URL: /api/messages/:id  (Jahan :id samne wale user ki ID hai)
router.get("/:id", protect, getMessages);

// 2. Send Message
// URL: /api/messages/send/:id (Jahan :id receiver ki ID hai)
router.post("/send/:id", protect, sendMessage);

module.exports = router;