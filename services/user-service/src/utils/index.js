import { config } from "../config/index.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

// To generate Access and Refresh tokens
export const generateAccessAndRefreshTokens = (user) => {
  logger.info(`Generating tokens for user ID: ${JSON.stringify(user)}`);
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY }
  );
  return { accessToken, refreshToken };
}

// To verify token
export const verifyTokens = () => {

}

