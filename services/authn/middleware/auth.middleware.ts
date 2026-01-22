import "../src/env";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const JWT_SECRET = process.env.JWT_SECRET!;
  console.log("Authenticating request...", JWT_SECRET);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Optional: Role-based guard
export const requireRole =
  (requiredRole: "USER" | "ADMIN") =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const roles = { USER: 1, ADMIN: 2 };
    if (roles[req.user.role as keyof typeof roles] < roles[requiredRole]) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
