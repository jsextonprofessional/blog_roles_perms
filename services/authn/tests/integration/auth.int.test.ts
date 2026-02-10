import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";

const app = createApp();

describe("Authentication Integration Tests", () => {
  // Clean up test users before each test
  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "test-",
        },
      },
    });
  });

  describe("POST /v1/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/v1/register").send({
        firstName: "Test",
        lastName: "User",
        email: "test-user@example.com",
        password: "SecurePassword123!",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User created");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toMatchObject({
        email: "test-user@example.com",
        firstName: "Test",
        lastName: "User",
        role: "USER",
      });
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });

    it("should register user with ADMIN role when specified", async () => {
      const response = await request(app).post("/v1/register").send({
        firstName: "Admin",
        lastName: "User",
        email: "test-admin@example.com",
        password: "AdminPassword123!",
        role: "ADMIN",
      });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe("ADMIN");
    });

    it("should return valid JWT token on registration", async () => {
      const response = await request(app).post("/v1/register").send({
        firstName: "Token",
        lastName: "Test",
        email: "test-token@example.com",
        password: "TokenPassword123!",
      });

      expect(response.status).toBe(201);
      const token = response.body.token;
      
      // Verify token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded).toHaveProperty("userId");
      expect(decoded).toHaveProperty("role", "USER");
    });

    it("should reject registration with missing fields", async () => {
      const response = await request(app).post("/v1/register").send({
        firstName: "Test",
        email: "incomplete@example.com",
        // Missing lastName and password
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Missing required fields");
    });

    it("should reject duplicate email registration", async () => {
      const userData = {
        firstName: "Test",
        lastName: "Duplicate",
        email: "test-duplicate@example.com",
        password: "Password123!",
      };

      // First registration
      await request(app).post("/v1/register").send(userData);

      // Attempt duplicate registration
      const response = await request(app).post("/v1/register").send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error", "Email already in use");
    });

    it("should hash password securely (not store plain text)", async () => {
      const password = "MySecretPassword123!";
      const response = await request(app).post("/v1/register").send({
        firstName: "Security",
        lastName: "Test",
        email: "test-security@example.com",
        password,
      });

      expect(response.status).toBe(201);
      const userId = response.body.user.id;

      // Verify password is hashed in database
      const user = await prisma.user.findUnique({ where: { id: userId } });
      expect(user?.passwordHash).not.toBe(password);
      expect(user?.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });

  describe("POST /v1/login", () => {
    const testUser = {
      firstName: "Login",
      lastName: "Test",
      email: "test-login@example.com",
      password: "LoginPassword123!",
    };

    beforeEach(async () => {
      // Create test user before login tests
      await request(app).post("/v1/register").send(testUser);
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/v1/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toMatchObject({
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      });
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });

    it("should return valid JWT token on login", async () => {
      const response = await request(app).post("/v1/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      const token = response.body.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded).toHaveProperty("userId");
      expect(decoded).toHaveProperty("role");
    });

    it("should reject login with incorrect password", async () => {
      const response = await request(app).post("/v1/login").send({
        email: testUser.email,
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app).post("/v1/login").send({
        email: "nonexistent@example.com",
        password: "SomePassword123!",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should reject login with missing email", async () => {
      const response = await request(app).post("/v1/login").send({
        password: testUser.password,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Email and password required",
      );
    });

    it("should reject login with missing password", async () => {
      const response = await request(app).post("/v1/login").send({
        email: testUser.email,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Email and password required",
      );
    });
  });

  describe("GET /v1/me", () => {
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create and login test user
      const registerResponse = await request(app).post("/v1/register").send({
        firstName: "Me",
        lastName: "Test",
        email: "test-me@example.com",
        password: "MePassword123!",
      });

      userToken = registerResponse.body.token;
      userId = registerResponse.body.user.id;
    });

    it("should return current user info with valid token", async () => {
      const response = await request(app)
        .get("/v1/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: userId,
        email: "test-me@example.com",
        firstName: "Me",
        lastName: "Test",
        role: "USER",
      });
      expect(response.body).not.toHaveProperty("passwordHash");
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/v1/me");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/v1/me")
        .set("Authorization", "Bearer invalid-token-here");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject request with expired token", async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId, role: "USER" },
        process.env.JWT_SECRET!,
        { expiresIn: "0s" },
      );

      const response = await request(app)
        .get("/v1/me")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /v1/admin-only", () => {
    let userToken: string;
    let adminToken: string;

    beforeEach(async () => {
      // Create regular user
      const userResponse = await request(app).post("/v1/register").send({
        firstName: "Regular",
        lastName: "User",
        email: "test-regular@example.com",
        password: "UserPassword123!",
        role: "USER",
      });
      userToken = userResponse.body.token;

      // Create admin user
      const adminResponse = await request(app).post("/v1/register").send({
        firstName: "Admin",
        lastName: "User",
        email: "test-admin-access@example.com",
        password: "AdminPassword123!",
        role: "ADMIN",
      });
      adminToken = adminResponse.body.token;
    });

    it("should allow admin to access admin-only endpoint", async () => {
      const response = await request(app)
        .get("/v1/admin-only")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
    });

    it("should reject regular user from admin-only endpoint", async () => {
      const response = await request(app)
        .get("/v1/admin-only")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject unauthenticated request", async () => {
      const response = await request(app).get("/v1/admin-only");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /health", () => {
    it("should return healthy status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
    });
  });
});
