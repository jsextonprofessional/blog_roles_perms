import type { UserContext } from "../../../services/blog/src/authz/types.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserContext | null;
    }
  }
}

export {};
