import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ["Admin", "Manager", "Developer"],
    default: "Developer"
  },
}, {
  timestamps: true
});

export const User = mongoose.model("User", userSchema);