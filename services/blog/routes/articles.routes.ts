import { Router } from "express";
import { ArticlesController } from "../controllers/index.js";
import { authenticate } from "../middleware/index.js";

const router = Router();

router.post("/articles", authenticate, ArticlesController.createArticle);
router.get("/articles", ArticlesController.getArticles);
router.patch("/articles/:id", authenticate, ArticlesController.updateArticle);
router.delete("/articles/:id", authenticate, ArticlesController.deleteArticle);

export default router;
