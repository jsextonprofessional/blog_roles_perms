import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type GatewayRequest = Request & { user?: { id: string; role: string } };

export function authMiddleware(
  req: GatewayRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
