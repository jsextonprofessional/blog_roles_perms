import type { Request, Response, NextFunction } from "express";
import pino from "pino";

const logger = pino();

export function auditMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  logger.info({
    method: req.method,
    path: req.path,
    user: req.user?.id,
    role: req.user?.role,
    timestamp: new Date().toISOString(),
  });
  next();
}