import "./env";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import articlesRoutes from "../routes/articles.routes.js";
import commentsRoutes from "../routes/comments.routes.js";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// move these into index to centralize
app.use("/v1", articlesRoutes);
app.use("/v1", commentsRoutes);

// Health check
app.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok" }),
);

app.listen(PORT, () => {
  console.log(`Blog service running on http://localhost:${PORT}`);
});
