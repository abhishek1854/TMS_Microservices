import dotenv from 'dotenv';
dotenv.config();
import packageJson from "../../package.json" assert { type: "json" };

export const config = {
  SERVICE_NAME: packageJson?.name,
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/tms-user-service-db",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

}
console.log(`Configuration Loaded: ${JSON.stringify(config)}`);