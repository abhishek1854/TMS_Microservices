import Redis from "ioredis"
import {config} from "./index.js";
import {logger} from "./logger.js";

let redisClient = null;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(config.REDIS_URL, {
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redisClient.on("connect", () => {
      logger.info("Connected to Redis");
    });

    redisClient.on("error", (err) => {
      logger.error(`Redis error: ${err}`);
    }); 

    redisClient.on("reconnecting", () => {
      logger.warn(`Reconnecting to Redis...`);
    });

    redisClient.on("close", () => {
      logger.warn("Redis connection closed");
    })
  }
  return redisClient;
}

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info("Disconnected from Redis");
    redisClient = null;
  }
}





