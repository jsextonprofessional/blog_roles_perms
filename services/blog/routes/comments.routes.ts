import { Router } from "express";
import { CommentsController } from "../controllers/index.js";
import { authenticate } from "../middleware/index.js";

const router = Router();

router.post(
  "/articles/:articleId/comments",
  authenticate,
  CommentsController.createComment,
);
router.get(
  "/articles/:articleId/comments",
  CommentsController.getCommentsByArticle,
);
router.patch("/comments/:id", authenticate, CommentsController.updateComment);
router.delete("/comments/:id", authenticate, CommentsController.deleteComment);

export default router;
