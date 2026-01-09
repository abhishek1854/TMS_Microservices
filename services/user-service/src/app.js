import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import logger from './config/logger.js';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './config/db.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB();

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

app.use("/api/v1/users", authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'User Service is healthy' });
});

app.listen(process.env.PORT || 3001, () => {
  logger.info(`User Service is running on port ${process.env.PORT || 3001}`);
});