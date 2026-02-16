const Message = require("../models/Message");
const { getReceiverSocketId, io } = require("../socket"); // Socket logic import

// --- 1. SEND MESSAGE ---
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // URL se receiver ki ID
    const senderId = req.user.id; // Login user ki ID

    // Database mein save karein
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    // --- REAL-TIME SOCKET LOGIC ---
    // Check karein agar receiver online hai
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      // Sirf us specific user ko message bhejein
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);

  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- 2. GET MESSAGES (Chat History) ---
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    // Wo saare messages dhundo jo in dono ke beech hue hain
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Purane pehle, naye baad mein

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };