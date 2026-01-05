import packageJson from "../../package.json" assert { type: "json" };

export const config = {

  SERVICE_NAME: packageJson?.name,

  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET || "your_default_auth_jwt_secret",
  GATEWAY_JWT_SECRET: process.env.GATEWAY_JWT_SECRET || "your_default_gateway_jwt_secret",
  GATEWAY_JWT_EXPIRES_IN: process.env.GATEWAY_JWT_EXPIRES_IN || "1m",

  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT, 10) || 30000, // 30 seconds

  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  // Microservice URLs
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:3001",
  PROJECT_SERVICE_URL: process.env.PROJECT_SERVICE_URL || "http://localhost:3002",
  TASK_SERVICE_URL: process.env.TASK_SERVICE_URL || "http://localhost:3003",
  ACTIVITY_SERVICE_URL: process.env.ACTIVITY_SERVICE_URL || "http://localhost:3004",
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3005",

};