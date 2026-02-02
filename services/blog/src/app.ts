import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { articlesRoutes, commentsRoutes } from "../routes/index.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  app.use("/v1", articlesRoutes);
  app.use("/v1", commentsRoutes);

  app.get("/health", (_req: Request, res: Response) =>
    res.json({ status: "ok" }),
  );

  return app;
}
