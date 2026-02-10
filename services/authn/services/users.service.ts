import "../src/env";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role?: "USER" | "ADMIN";
}) {
  return await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role || "USER",
    },
  });
}

export function signJwt(userId: string, role: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
