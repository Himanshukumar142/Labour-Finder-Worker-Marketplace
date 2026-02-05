// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// require('dotenv').config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(helmet());
// app.use(express.json());
// app.use('/api/workers', require('./routers/workerRouters'));
// app.use('/api/otp',require('./routers/otpRouter'))
// app.use('/api/leads', require('./routers/leadRoutes'));
// // Test Route
// app.get("/", (req, res) => {
//   res.send("API is working fine 🚀");
// });

// // Routes
// const authRoutes = require('./routers/authRoutes');
// app.use('/api/auth', authRoutes);

// // Database
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ LabourFinder database connected!"))
//   .catch((err) => console.log("🌋 Connection error:", err.message));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routers/authRoutes");
const workerRoutes = require("./routers/workerRouters");
const workerOtpRoutes = require('./routers/workerOtpRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", require("./routers/dashboardRoutes"));

app.use('/api/workers/otp', workerOtpRoutes);

app.use("/api", workerRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
