import { createProxyMiddleware } from "http-proxy-middleware";

import logger from "./logger.js";
import { config } from "./index.js";

const serviceConfig = [
  {
    path: "/api/v1/users",
    url: config.USER_SERVICE_URL,
    pathRewrite: { "^/" : "/api/v1/users/" },
    name: "user-service",
    timeout: 5000,
  },
  {
    path: "/api/v1/projects",
    url: config.PROJECT_SERVICE_URL,
    pathRewrite: { "^/" : "/api/v1/projects/" },
    name: "project-service",
  },
  {
    path: "/api/v1/tasks",
    url: config.TASK_SERVICE_URL,
    pathRewrite: { "^/" : "/api/v1/tasks/" },
    name: "task-service",
  },
  {
    path: "/api/v1/activities",
    url: config.ACTIVITY_SERVICE_URL,
    pathRewrite: { "^/" : "/api/v1/activities/" },
    name: "activity-service",
  },
  {
    path: "/api/v1/notifications",
    url: config.NOTIFICATION_SERVICE_URL,
    pathRewrite: { "^/" : "/api/v1/notifications/" },
    name: "notification-service",
  }
]

const handleProxyError = (err, req, res, target) => {
  logger.error(`Error proxying request to ${target}: ${err.message}`);

  res.status(503).setHeader("Content-Type", "application/json").end(JSON.stringify({
    message: "Service Unavailable",
    timestamp: new Date().toISOString(),
  }));
}
const handleProxyRequest = (proxyReq, req, res) => {
  // logger.info(`Proxying request ${req.method} ${req.url} to ${proxyReq.getHeader("host")}`);
}

const handleProxtyResponse = (proxyRes, req, res) => {
  // logger.info(`Received response with status ${proxyRes.statusCode} for ${req.method} ${req.url}`);
}

const createProxyOptions = (service) => ({
  target: service.url,
  changeOrigin: true,
  pathRewrite: service.pathRewrite,
  timeout: service.timeout || config.DEFAULT_TIMEOUT,
  logger: logger,
  on : {
    error: handleProxyError,
    proxyReq: handleProxyRequest,
    proxyRes: handleProxtyResponse,
  }
})

const setupProxy = (app) => {
  serviceConfig.forEach((service) => {
    const proxyOptions = createProxyOptions(service);
    app.use(service.path, createProxyMiddleware(proxyOptions));
    logger.info(`Proxy setup for ${service.name} at path ${service.path} to URL ${service.url}`);
  });
}

export default setupProxy;