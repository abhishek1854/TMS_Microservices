import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";

import logger from "./config/logger.js";
import { config } from "./config/index.js";
import { limiter } from "./middlewares/reteLimiter.js";
import setupProxy from "./config/services.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is healthy" });
});

// Setup proxy for microservices
setupProxy(app);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error processing request ${req.method} ${req.url}: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found" });
});

// Start the server
const startServer = () =>{
  try {
    app.listen(process.env.PORT || 3000, () => {
      logger.info(`${config.SERVICE_NAME} is running on port ${process.env.PORT || 3000}`);
    })
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();