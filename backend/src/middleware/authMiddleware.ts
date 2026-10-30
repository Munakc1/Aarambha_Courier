import { NextFunction, Request, Response } from "express";
import { verifyVendorToken } from "../utils/token";

export interface AuthenticatedRequest extends Request {
  vendorId?: string;
}

export function requireVendorAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const cookieName =
      process.env.COOKIE_NAME || "aarambha_vendor_token";

    const token = req.cookies?.[cookieName];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required."
      });
      return;
    }

    const decoded = verifyVendorToken(token);

    req.vendorId = decoded.vendorId;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication session."
    });
  }
}