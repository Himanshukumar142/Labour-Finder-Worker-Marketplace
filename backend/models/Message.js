const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Optional: Agar future mein images/files bhejni ho
    fileUrl: {
      type: String,
      default: ""
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } // CreatedAt automatically aa jayega
);

module.exports = mongoose.model("Message", messageSchema);