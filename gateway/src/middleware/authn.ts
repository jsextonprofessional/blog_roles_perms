import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { AuthenticatedUser } from "../../../shared/auth.js";

export function authnMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header) {
    req.user = null;
    return next();
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
