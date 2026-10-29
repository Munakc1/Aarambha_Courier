
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME =
  process.env.COOKIE_NAME || "aarambha_vendor_token";

type VendorTokenPayload = jwt.JwtPayload & {
  vendorId?: string;
  id?: string;
};

export interface VendorRequest extends Request {
  vendorId?: string;
}

export function requireVendorAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as VendorRequest;
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access your vendor profile.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      message: "Authentication is not configured correctly.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      !decoded ||
      typeof decoded !== "object"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid login session.",
      });
    }

    const payload = decoded as VendorTokenPayload;
    const vendorId = payload.vendorId || payload.id || payload.sub;

    if (
      typeof vendorId !== "string" ||
      !/^[a-f\d]{24}$/i.test(vendorId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid vendor login session.",
      });
    }

    request.vendorId = vendorId;
    next();
  } catch {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(401).json({
      success: false,
      message: "Your login session has expired. Please log in again.",
    });
  }
}
