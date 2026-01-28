import { Request, Response } from "express";
import { ArticlesService } from "../services/index.js";
import { canDeleteArticle } from "../src/authz/index.js";
import { AuthenticatedRequest } from "../middleware/index.js";

export async function createArticle(req: Request, res: Response) {
  const { title, content, authorId } = req.body;

  if (!title || !content || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const article = await ArticlesService.createArticle({
      title,
      content,
      authorId,
    });

    res.status(201).json({ message: "Article created", article });
  } catch (error) {
    console.error("Error creating article (articles.controller) :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getArticles(req: Request, res: Response) {
  try {
    const articles = await ArticlesService.getArticles();
    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error fetching articles (articles.controller):", error);
    res
      .status(500)
      .json({ error: "Internal server error (articles.controller)" });
  }
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const article = await ArticlesService.updateArticle(id, {
      title,
      content,
    });

    res.status(200).json({ message: "Article updated", article });
  } catch (error) {
    console.error("Error updating article (articles.controller):", error);
    res
      .status(500)
      .json({ error: "Internal server error (articles.controller)" });
  }
}

export async function deleteArticle(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  const { id } = req.params;

  try {
    const article = await ArticlesService.getArticleById(id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const allowed = canDeleteArticle(req.user, article);

    if (!allowed) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await ArticlesService.deleteArticle(id);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article (articles.controller):", error);
    res
      .status(500)
      .json({ error: "Internal server error (articles.controller)" });
  }
}
