const express = require("express");
const router = express.Router();
const { protect } = require("../models/middlewares/authMiddleware");
const { getNotifications, markAsRead } = require("../controllers/notificationController");

// --- ROUTES ---

// 1. Get All Notifications
// GET /api/notifications
router.get("/", protect, getNotifications);

// 2. Mark as Read (Specific or All)
// PUT /api/notifications/:id/read  (id can be "all" or specific ID)
router.put("/:id/read", protect, markAsRead);

module.exports = router;
