const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const NotificationSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
