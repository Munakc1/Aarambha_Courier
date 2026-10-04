import express from "express";
import { hash, verify as verifyPassword } from "@lacspace/password";
import { sign } from "@lacspace/jwt";
import { asyncHandler, HttpError } from "../http.js";
import { requireAuth } from "../middleware/auth.js";
import { User, type UserDoc } from "../models/user.js";
import { env } from "../env.js";
import { RegisterInput, LoginInput } from "../validation.js";
import type { AuthResponse, User as UserDTO } from "@ammrambha_courier/types";

const ISSUER = "ammrambha_courier-api";
const WEEK = 60 * 60 * 24 * 7; // token lifetime, in seconds
const router = express.Router();

function toDTO(u: UserDoc): UserDTO {
  return { id: String(u._id), email: u.email, name: u.name, createdAt: u.createdAt.toISOString() };
}
function tokenFor(u: UserDoc): Promise<string> {
  return sign({ sub: String(u._id), email: u.email }, env.JWT_SECRET, { expiresIn: WEEK, issuer: ISSUER });
}

// POST /auth/register — create an account, return a JWT + the user.
router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = RegisterInput.parse(req.body);
  if (await User.findOne({ email })) throw new HttpError(409, "That email is already registered");
  const passwordHash = await hash(password); // PBKDF2 via @lacspace/password
  const user = await User.create({ name, email, passwordHash });
  const out: AuthResponse = { token: await tokenFor(user), user: toDTO(user) };
  res.status(201).json(out);
}));

// POST /auth/login — verify credentials, return a JWT + the user.
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = LoginInput.parse(req.body);
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  const out: AuthResponse = { token: await tokenFor(user), user: toDTO(user) };
  res.json(out);
}));

// GET /auth/me — the current user (requires a valid token).
router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.sub);
  if (!user) throw new HttpError(404, "User not found");
  res.json(toDTO(user));
}));

export default router;
