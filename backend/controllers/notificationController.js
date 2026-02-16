const Notification = require("../models/Notification");

// --- 1. GET NOTIFICATIONS ---
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 }); // Latest pehle

        // Count unread
        const unreadCount = await Notification.countDocuments({
            userId: req.user.id,
            read: false
        });

        res.json({ notifications, unreadCount });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- 2. MARK AS READ ---
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        // Agar ID "all" hai, toh sabko read kar do
        if (id === "all") {
            await Notification.updateMany(
                { userId: req.user.id, read: false },
                { $set: { read: true } }
            );
            return res.json({ message: "All notifications marked as read" });
        }

        // Specific notification ko read karo
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Check ownership
        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        notification.read = true;
        await notification.save();

        res.json(notification);

    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getNotifications, markAsRead };
