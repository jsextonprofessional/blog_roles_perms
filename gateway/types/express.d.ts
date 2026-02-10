import "express";
import { AuthenticatedUser } from "../../shared/auth";

declare module "express-serve-static-core" {
  interface Request {
    user: AuthenticatedUser | null;
  }
}
