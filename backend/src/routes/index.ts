import type { Express, RequestHandler } from "express";
import { rateLimit, expressRateLimit } from "@lacspace/rate-limit";
import { requireAuth } from "../middleware/auth.js";
import authRoutes from "./auth.js";
import noteRoutes from "./notes.js";
import accountRoutes from "./account.js";
import checkoutRoutes from "./checkout.js";
import emailRoutes from "./email.js";
import liveRoutes from "./live.js";

// how this works: every route group is mounted here. Add a new resource by creating
// a router in routes/ and adding one app.use(...) line below.
export function registerRoutes(app: Express): void {
  // Brute-force protection on auth: 20 requests / minute / IP (@lacspace/rate-limit).
  const authLimiter = expressRateLimit(rateLimit({ limit: 20, windowMs: 60_000 })) as unknown as RequestHandler;
  app.use("/auth", authLimiter, authRoutes);
  app.use("/notes", noteRoutes);
  app.use("/account", requireAuth, accountRoutes);
  app.use("/checkout", requireAuth, checkoutRoutes);
  app.use("/email", requireAuth, emailRoutes);
  app.use("/live", liveRoutes);
}
