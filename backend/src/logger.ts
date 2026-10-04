import { createLogger, jsonConsole, prettyConsole } from "@lacspace/logger";
import type { Request, Response, NextFunction } from "express";
import { env } from "./env.js";

// how this works: one structured logger for the whole API (@lacspace/logger, zero-dep).
// In production we emit JSON-per-line (clean for log aggregators); in dev we print a
// readable, coloured line. Common secret fields are redacted before anything is logged.
const isProd = env.NODE_ENV === "production";
export const log = createLogger({
  level: isProd ? "info" : "debug",
  transports: [isProd ? jsonConsole() : prettyConsole({ colors: true })],
  redact: ["password", "token", "authorization", "*.password", "*.token"],
});

// Request logger — one line per request with method, path, status and duration.
// Each request gets a child logger with a short request id you can thread through.
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const reqId = Math.random().toString(36).slice(2, 10);
  (req as Request & { log: typeof log }).log = log.child({ reqId });
  res.on("finish", () => {
    log.info("request", {
      reqId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
}
