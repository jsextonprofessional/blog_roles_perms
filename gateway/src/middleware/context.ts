import { Request, Response, NextFunction } from "express";
import { USER_CONTEXT_HEADER } from "../../../shared/auth.js";

export function contextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.user) {
    req.headers[USER_CONTEXT_HEADER] = JSON.stringify(req.user);
  }
  next();
}
