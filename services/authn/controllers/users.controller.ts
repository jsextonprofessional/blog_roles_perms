import { Request, Response } from "express";
import * as UsersService from "../services/users.service";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

export async function registerUser(req: AuthRequest, res: Response) {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await UsersService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await UsersService.hashPassword(password);

    const user = await UsersService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      role: role || "USER",
    });

    const token = UsersService.signJwt(user.id, user.role);

    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user (users.controller):", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function loginUser(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await UsersService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await UsersService.comparePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = UsersService.signJwt(user.id, user.role);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user (users.controller):", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCurrentUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await UsersService.getUserById(req.user.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
  // const userId = res.locals.userId;
  // try {
  //   const user = await UsersService.getUserById(userId);
  //   if (!user) {
  //     return res.status(404).json({ error: "User not found" });
  //   }
  //   res.status(200).json({
  //     id: user.id,
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     role: user.role,
  //   });
  // } catch (error) {
  //   console.error("Error fetching current user (users.controller):", error);
  //   res.status(500).json({ error: "Internal server error" });
  // }
}

export async function getAdminOnly(req: Request, res: Response) {
  res.status(200).json({ message: "Welcome, admin user!" });
}
