const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

// HTTP Server banaya (Express ke upar)
const server = http.createServer(app);

// Socket.io Server banaya
const io = new Server(server, {
	cors: {
		// Frontend ke URLs allow karein (Vite: 5173, React: 3000)
		origin: ["http://localhost:5173", "http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

// --- USER ONLINE STATUS TRACKING ---
// Format: { userId: socketId }
const userSocketMap = {}; 

// Ye function Controller use karega message bhejne ke liye
const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

// --- SOCKET CONNECTION LOGIC ---
io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	// Frontend se userId query mein aayega
	const userId = socket.handshake.query.userId;
	
	if (userId != "undefined") {
        userSocketMap[userId] = socket.id; // Map mein save kiya
    }

	// Sabko batao kaun-kaun Online hai
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// Jab user disconnect ho jaye (Tab band kare ya net chala jaye)
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId]; // Map se hatao
		io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update list bhejo
	});
});

// Export karna zaroori hai taaki server.js aur controllers isse use kar sakein
module.exports = { app, io, server, getReceiverSocketId };