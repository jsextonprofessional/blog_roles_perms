// src/middleware/auth.middleware.ts
import "../env";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    permissionLevel: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      permissionLevel: string;
    };

    req.user = {
      userId: payload.userId,
      permissionLevel: payload.permissionLevel,
    };

    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Optional: Role-based guard
export const requirePermission =
  (requiredLevel: "READER" | "WRITER" | "EDITOR") =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const levels = { READER: 1, WRITER: 2, EDITOR: 3 };
    if (levels[req.user.permissionLevel as keyof typeof levels] < levels[requiredLevel]) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };