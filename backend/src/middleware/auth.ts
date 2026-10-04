import type { RequestHandler } from "express";
import { expressJwt } from "@lacspace/jwt";
import { env } from "../env.js";

// how this works: verifies the "Authorization: Bearer <token>" header with
// @lacspace/jwt and attaches the decoded payload to req.user (see express.d.ts).
// Missing/invalid token → it responds 401 automatically. Put it on any route you
// want protected:  router.get("/secret", requireAuth, handler)
// (@lacspace/jwt's middleware is framework-agnostic, so we cast it to Express's
//  RequestHandler — it's a standard (req, res, next) function underneath.)
export const requireAuth = expressJwt(env.JWT_SECRET, { issuer: "ammrambha_courier-api" }) as unknown as RequestHandler;
