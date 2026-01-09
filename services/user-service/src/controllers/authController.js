import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import bcrypt from "bcryptjs";
import { config } from "../config/index.js";
import logger from "../config/logger.js";
import { generateAccessAndRefreshTokens } from "../utils/index.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;
    logger.debug(`JSON Body: ${JSON.stringify(req.body)}`);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    console.log('existingUser: ', existingUser);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log('newUser: ', newUser);

    await newUser.save();

    res.status(201).json({
      data: { newUser },
      meta: {
        message: "User registered successfully",
        success: true,
      }
    });

  } catch (error) {
    logger.error(`Error in register controller: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }, "+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user);
    logger.debug(`Generated tokens for user ${accessToken, refreshToken}`);

    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isRevoked: false
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    logger.error(`Error in login controller: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

// Refresh token
export const refreshToken = async (req, res) => {
  const { token } = req.body;
  logger.info(`Received refresh token request with token: ${token}`);
  try {
    const storedToken = await RefreshToken.findOne({ token, isRevoked: false });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
    const user = await User.findById(storedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshTokens(user);
    logger.debug(`Generated new tokens for user ${user._id}`);

    // Upsert - updates existing token or creates new one
    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isRevoked: false
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    logger.error(`Error in refreshToken controller: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
// Logout user
export const logout = async (req, res) => {
  const { token } = req.body;
  try {
    await RefreshToken.findOneAndUpdate(
      { token, isRevoked: false },
      { isRevoked: true }
    );
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error in logout controller: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};