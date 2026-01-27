const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API is working fine 🚀");
});

// Routes
const authRoutes = require('./routers/authRoutes');
app.use('/api/auth', authRoutes);

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ LabourFinder database connected!"))
  .catch((err) => console.log("🌋 Connection error:", err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
