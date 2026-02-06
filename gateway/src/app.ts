import express from "express";
import { authnMiddleware } from "./middleware/authn.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import { auditMiddleware } from "./middleware/audit.js";
import blogProxy from "./proxy/blogProxy.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(rateLimitMiddleware);
  app.use(auditMiddleware);

  app.use("/v1", authnMiddleware, blogProxy);

  return app;
}
