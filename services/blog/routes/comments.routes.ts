import { Router } from "express";
import { CommentsController } from "../controllers/index.js";

const router = Router();

router.post("/articles/:articleId/comments", CommentsController.createComment);
router.get(
  "/articles/:articleId/comments",
  CommentsController.getCommentsByArticle,
);
router.patch("/comments/:id", CommentsController.updateComment);
router.delete("/comments/:id", CommentsController.deleteComment);

export default router;
