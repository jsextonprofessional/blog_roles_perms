import express from "express";
import cors from "cors";
import { authnMiddleware } from "./middleware/authn.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import { auditMiddleware } from "./middleware/audit.js";
import { errorMiddleware } from "./middleware/error.js";
import blogProxy from "./proxy/blog.proxy.js";
import authProxy from "./proxy/auth.proxy.js";

export function createApp() {
  const app = express();

  // CORS configuration - allow frontend to make requests
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.json());

  // Global middleware
  app.use(rateLimitMiddleware);
  app.use(auditMiddleware);

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes (public and protected)
  app.use("/v1/auth", authProxy);

  // Protected blog routes (requires authentication)
  app.use("/v1", authnMiddleware, blogProxy);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}
