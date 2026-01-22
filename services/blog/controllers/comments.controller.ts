import { Request, Response } from "express";
import * as CommentsService from "../services/comments.service.js";

export async function createComment(req: Request, res: Response) {
  const { articleId } = req.params;
  const { content, authorId } = req.body;

  if (!content || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const comment = await CommentsService.createComment({
      articleId,
      content,
      authorId,
    });

    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    console.error("Error creating comment (comments.controller):", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCommentsByArticle(req: Request, res: Response) {
  const { articleId } = req.params;

  try {
    const comments = await CommentsService.getCommentsByArticle(articleId);
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments (comments.controller):", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateComment(req: Request, res: Response) {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await CommentsService.updateComment(id, {
      content,
    });
    res.status(200).json({ message: "Comment updated", comment });
  } catch (error) {
    console.error("Error updating comment (comments.controller):", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await CommentsService.deleteComment(id);
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment (comments.controller):", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
