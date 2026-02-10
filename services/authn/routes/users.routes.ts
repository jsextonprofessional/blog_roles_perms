import { Router } from "express";
import * as UsersController from "../controllers/users.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", UsersController.registerUser);
router.post("/login", UsersController.loginUser);
router.get("/me", authenticate, UsersController.getCurrentUser);
router.get(
  "/admin-only",
  authenticate,
  requireRole("ADMIN"),
  UsersController.getAdminOnly,
);

export default router;
