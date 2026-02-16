const jwt = require("jsonwebtoken");
const User = require("../CreatorModel");
const AuthUser = require("../../models/AuthUser"); // Add AuthUser

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

const protect = async (req, res, next) => {
  try {
    // console.log("AUTH HEADER:", req.headers.authorization); 

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    // console.log("TOKEN:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("DECODED:", decoded); 

    // 1. Try finding user in CreatorModel (Agents/Personal)
    let user = await User.findById(decoded.id).select("-password");

    // 2. If not found, try finding in AuthUser (Freelancer/Client - New Architecture)
    if (!user) {
      user = await AuthUser.findById(decoded.id).select("-password");
    }

    // console.log("USER FOUND:", !!user); 

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    // req.user.role = decoded.role; // Token doesn't have role, user object has it.

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
