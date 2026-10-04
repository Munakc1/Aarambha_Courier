import express from "express";
import cors from "cors";
import { expressSecurityHeaders } from "@lacspace/headers";
import { env } from "./env.js";
import { requestLogger } from "./logger.js";
import { errorHandler } from "./middleware/error.js";
import { registerRoutes } from "./routes/index.js";

// how this works: assembles the Express app — security headers, CORS for the
// frontend, JSON parsing, structured request logging (@lacspace/logger), a health
// check, all route groups (see routes/index.ts), then the error handler LAST.
export function createApp(): express.Express {
  const app = express();

  // Express advertises itself in every response by default; there is no reason
  // to tell the internet what the API is built on.
  app.disable("x-powered-by");

  // The same hardening the frontend gets, tuned for an API: deny framing, send
  // no referrer, and a CSP that allows nothing — an API returns JSON, so there
  // is no script, style or image for a browser to load from it.
  app.use(expressSecurityHeaders({
    frameOptions: "DENY",
    referrerPolicy: "no-referrer",
    crossOriginResourcePolicy: "same-site",
    contentSecurityPolicy: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
  }));

  app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()), credentials: true }));
  // A JSON API has no business accepting a megabyte of body by default.
  app.use(express.json({ limit: "256kb" }));
  app.use(requestLogger); // one structured log line per request

  app.get("/health", (_req, res) => { res.json({ ok: true, service: "ammrambha_courier-api" }); });
  registerRoutes(app);

  app.use(errorHandler);
  return app;
}
