import express from "express";
import fetch from "node-fetch";
import { config } from "../config.js";
import { contextMiddleware } from "../middleware/context.js";

const router = express.Router();

router.use(contextMiddleware);

// Proxy handler function
async function proxyToBlogService(req: express.Request, res: express.Response) {
  try {
    const url = `${config.services.blog}${req.originalUrl}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        "x-user-context": req.headers["x-user-context"] as string,
      },
      body: req.method !== "GET" && req.method !== "HEAD" 
        ? JSON.stringify(req.body) 
        : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    console.error("Blog proxy error:", error);
    res.status(500).json({ error: "Failed to proxy request to blog service" });
  }
}

// Articles routes
router.all("/articles", proxyToBlogService);
router.all("/articles/:id", proxyToBlogService);

// Comments routes  
router.all("/articles/:articleId/comments", proxyToBlogService);
router.all("/comments/:id", proxyToBlogService);

export default router;
