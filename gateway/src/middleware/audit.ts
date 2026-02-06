import type { Request, Response, NextFunction } from "express";
import pino from "pino";

const logger = pino();

export function auditMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {}
