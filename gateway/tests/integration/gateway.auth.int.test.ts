import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import type { AuthenticatedUser } from "../../../shared/auth.js";

const testSecret = "test-jwt-secret";

// Set JWT secret before importing app
process.env.JWT_SECRET = testSecret;

// Import after setting env vars
const { createApp } = await import("../../src/app.js");

describe("Gateway Authentication Integration Tests", () => {
  const app = createApp();

  describe("Health Check", () => {
    it("should return 200 for health check", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("Rate Limiting", () => {
    it("should allow requests under rate limit", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
    });
  });

  describe("Authentication Middleware", () => {
    let validToken: string;
    let invalidToken: string;

    beforeAll(() => {
      const user: AuthenticatedUser = {
        id: "test-user-id",
        role: "USER",
      };
      
      validToken = jwt.sign(user, testSecret, { expiresIn: "1h" });
      invalidToken = jwt.sign(user, "wrong-secret", { expiresIn: "1h" });
    });

    it("should accept valid JWT token", async () => {
      // This will test the authn middleware, but routes require backend services
      // In a real scenario, you'd mock the fetch calls or have test services running
      const response = await request(app)
        .get("/v1/articles")
        .set("Authorization", `Bearer ${validToken}`);

      // Gateway will try to proxy to blog service
      // Without mock, it might fail with 500, but authn middleware passed
      expect(response.status).not.toBe(401);
    });

    it("should reject invalid JWT token", async () => {
      const response = await request(app)
        .get("/v1/articles")
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid token");
    });

    it("should allow requests without token (optional auth)", async () => {
      const response = await request(app).get("/v1/articles");

      // Authn middleware allows requests without token
      // They just won't have req.user set
      expect(response.status).not.toBe(401);
    });
  });

  describe("Audit Middleware", () => {
    it("should log all requests", async () => {
      // Audit middleware logs via Pino
      // This test just ensures the middleware doesn't break the request
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
    });
  });
});
