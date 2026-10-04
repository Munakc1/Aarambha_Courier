import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "@lacspace/validate";
import { HttpError } from "../http.js";

// how this works: ONE place that turns thrown errors into clean JSON responses.
// Register it LAST (after all routes). Express identifies it by its 4 arguments.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: "Validation failed", fields: err.flatten() });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
