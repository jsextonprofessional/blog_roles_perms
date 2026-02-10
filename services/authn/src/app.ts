import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import usersRoutes from "../routes/users.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  app.use("/v1", usersRoutes);

  app.get("/health", (_req: Request, res: Response) =>
    res.json({ status: "ok" }),
  );

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
