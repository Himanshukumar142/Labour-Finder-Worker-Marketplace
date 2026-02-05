const jwt = require("jsonwebtoken");
const User = require("../CreatorModel");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

const protect = async (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization); // 👈 ADD

    if (!req.headers.authorization?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("TOKEN:", token); // 👈 ADD

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("DECODED:", decoded); // 👈 ADD

    const user = await User.findById(decoded.id).select("-password");
    console.log("USER FOUND:", !!user); // 👈 ADD

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.user.role = decoded.role; // ✅ MUST

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); // 👈 ADD
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
