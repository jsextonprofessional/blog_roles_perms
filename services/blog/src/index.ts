import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// create article
app.post("/v1/articles", async (req, res) => {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json({
      message: "Article created",
      article: {
        id: article.id,
        title: article.title,
        content: article.content,
        authorId: article.authorId,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// read articles
app.get("/v1/articles", async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update article
app.patch("/v1/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Article updated",
      article: {
        id: article.id,
        title: article.title,
        content: article.content,
        authorId: article.authorId,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
