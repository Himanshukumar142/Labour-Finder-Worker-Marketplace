
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routers/authRoutes");
const workerRoutes = require("./routers/workerRouters");
const workerOtpRoutes = require('./routers/workerOtpRoutes');

dotenv.config();
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:5173", // Frontend ka exact URL (Vite default)
  credentials: true,               // Cookies/Token allow karne ke liye zaroori
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", require("./routers/dashboardRoutes"));

app.use('/api/workers/otp', workerOtpRoutes);
app.use("/api", workerRoutes);


const freelanceAuthRoutes = require("./routers/freelanceAuthRoutes");

const messageRoutes = require("./routers/messageRoutes");
const proposalRoutes = require("./routers/proposalRoutes");
const contractRoutes = require("./routers/contractRoutes");
const freelancerProfileRoutes = require("./routers/freelancerProfileRoutes");
const jobRoutes = require("./routers/jobRoutes");
const clientProfileRoutes = require("./routers/clientProfileRoutes");

app.use("/api/freelancer/auth", freelanceAuthRoutes);;
app.use("/api/freelancer/profile", freelancerProfileRoutes); // URL: /api/freelancer/profile/me
app.use("/api/client/profile", clientProfileRoutes);
app.use("/api/client", clientProfileRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", require("./routers/notificationRoutes"));

app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/wallet", require("./routers/walletRoutes"));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user joining with their ID
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


