import winston from "winston";

export const createLogger = (serviceName, logLevel = "info") => {
  return winston.createLogger({
    level: logLevel,
    defaultMeta: { service: serviceName },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, service }) => {
        return `[${timestamp}] [${level}] [${service}]: ${message}`;
      })),
      transports: [
      new winston.transports.Console(),
    ],
  });
} 