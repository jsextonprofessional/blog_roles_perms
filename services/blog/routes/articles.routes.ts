import { Router } from "express";
import { ArticlesController } from "../controllers/index.js";

const router = Router();

router.post("/articles", ArticlesController.createArticle);
router.get("/articles", ArticlesController.getArticles);
router.patch("/articles/:id", ArticlesController.updateArticle);
router.delete("/articles/:id", ArticlesController.deleteArticle);

export default router;
