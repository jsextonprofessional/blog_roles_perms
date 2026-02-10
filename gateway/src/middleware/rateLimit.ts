import rateLimit from "express-rate-limit";
export const rateLimitMiddleware = rateLimit({
  windowMs: 60_000,
  max: 100,
});
