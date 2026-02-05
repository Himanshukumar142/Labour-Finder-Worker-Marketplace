const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // ✅ use bcrypt

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    shopName: { type: String, default: "Personal/Social Worker" },
    role: {
      type: String,
      default: "agent",
      enum: ["agent", "personal"],
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Pre-save hook to hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
