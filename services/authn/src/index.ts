import "./env";
import express, { Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import {
//   authenticate,
//   AuthRequest,
//   requireRole,
// } from "../middleware/auth.middleware";
import usersRoutes from "../routes/users.routes";

const app = express();
const PORT = process.env.PORT || 4000;
// const JWT_SECRET = process.env.JWT_SECRET!;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// // Helper to sign JWT
// const signJwt = (userId: string, role: string) => {
//   return jwt.sign(
//     { userId, role },
//     JWT_SECRET,
//     { expiresIn: "7d" }, // adjust as needed
//   );
// };

// LOGIN
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password required" });
//   }

//   try {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const valid = await bcrypt.compare(password, user.passwordHash);
//     if (!valid) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = signJwt(user.id, user.role);

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Protected route example
// app.get("/me", authenticate, (req: AuthRequest, res: Response) => {
//   res.json({
//     message: "Protected route accessed",
//     user: req.user,
//   });
// });

// Example with permission guard
// app.get(
//   "/admin-only",
//   authenticate,
//   requireRole("ADMIN"),
//   (req: AuthRequest, res: Response) => {
//     res.json({ message: "Welcome, Admin!" });
//   },
// );

app.use("/v1", usersRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ error: "Internal server error (authn/index)" });
});

app.listen(PORT, () => {
  console.log(`Authn service running on http://localhost:${PORT}`);
});
