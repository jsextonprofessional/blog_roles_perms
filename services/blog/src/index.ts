import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// create article
app.post("/articles", async (req, res) => {
  // Implementation here
  res.status(201).json({ message: "Article created" });
}
// read articles
// update article
// delete article

// create comment
// read comments
// update comment
// delete comment

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Blog service running on http://localhost:${PORT}`);
});
