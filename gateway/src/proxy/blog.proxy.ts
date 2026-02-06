import express from "express";
import fetch from "node-fetch";
import { config } from "../config.js";
import { contextMiddleware } from "../middleware/context.js";

const router = express.Router();

router.use(contextMiddleware);

router.all("/articles/*", async (req, res) => {
  const url = `${config.services.blog}${req.originalUrl}`;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      "x-user-context": req.headers["x-user-context"] as string,
    },
    body: req.method === "GET" ? JSON.stringify(req.body) : undefined,
  });

  const text = await response.text();
  res.status(response.status).send(text);
});

export default router;
