import "./env";
import express, { Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  authenticate,
  AuthRequest,
  requirePermission,
} from "./middleware/auth.middleware";

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET!;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Helper to sign JWT
const signJwt = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: "7d" } // adjust as needed
  );
};

// REGISTER
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        passwordHash,
        role: role || "USER", // default to USER
        updatedAt: new Date(),
      },
    });

    const token = signJwt(user.id, user.role);

    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signJwt(user.id, user.role);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Protected route example
app.get("/me", authenticate, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Example with permission guard
app.get(
  "/admin-only",
  authenticate,
  requirePermission("ADMIN"),
  (req: AuthRequest, res: Response) => {
    res.json({ message: "Welcome, Admin!" });
  }
);

app.listen(PORT, () => {
  console.log(`Authn service running on http://localhost:${PORT}`);
});
