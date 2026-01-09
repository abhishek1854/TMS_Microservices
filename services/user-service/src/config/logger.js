import { config } from "./index.js";
import { createLogger } from "@tms/shared";

// const logger = winston.createLogger({
//   level: config.LOG_LEVEL,
//   defaultMeta: { service: config.SERVICE_NAME },
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ timestamp, level, message, service }) => {
//       return `[${timestamp}] [${level}] [${service}]: ${message}`;
//     })),
//     transports: [
//     new winston.transports.Console(),
//   ],
// })

const logger = createLogger(config.SERVICE_NAME, config.LOG_LEVEL);

export default logger; 