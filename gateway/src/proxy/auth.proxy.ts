import express from "express";
import fetch from "node-fetch";
import { config } from "../config.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", async (req, res) => {
  try {
    const url = `${config.services.authn}/v1/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Auth proxy error:", error);
    res.status(500).json({ error: "Failed to proxy request to auth service" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const url = `${config.services.authn}/v1/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Auth proxy error:", error);
    res.status(500).json({ error: "Failed to proxy request to auth service" });
  }
});

// Protected routes (pass through with user context)
router.get("/me", async (req, res) => {
  try {
    const url = `${config.services.authn}/v1/me`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: req.headers.authorization || "",
      },
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Auth proxy error:", error);
    res.status(500).json({ error: "Failed to proxy request to auth service" });
  }
});

router.get("/admin-only", async (req, res) => {
  try {
    const url = `${config.services.authn}/v1/admin-only`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: req.headers.authorization || "",
      },
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Auth proxy error:", error);
    res.status(500).json({ error: "Failed to proxy request to auth service" });
  }
});

export default router;
