import jwt from "jsonwebtoken";

export interface VendorTokenPayload {
  vendorId: string;
  role: "vendor";
}

export function createVendorToken(
  vendorId: string,
  remember: boolean
): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      vendorId,
      role: "vendor"
    },
    secret,
    {
      expiresIn: remember ? "30d" : "1d"
    }
  );
}

export function verifyVendorToken(
  token: string
): VendorTokenPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.verify(token, secret) as VendorTokenPayload;
}