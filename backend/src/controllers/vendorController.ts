import crypto from "crypto";
import { Request, Response } from "express";
import Vendor from "../models/vendor.model.js";
import {
  comparePassword,
  hashPassword
} from "../utils/password";
import {
  createVendorToken
} from "../utils/token";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { sendVendorPasswordResetEmail } from "../utils/sendEmail";

function getCookieName(): string {
  return process.env.COOKIE_NAME || "aarambha_vendor_token";
}

function getCookieOptions(remember: boolean) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    path: "/",
    ...(remember
      ? { maxAge: 30 * 24 * 60 * 60 * 1000 }
      : {})
  };
}

function sanitizeVendor(vendor: any) {
  return {
    id: vendor._id,
    fullName: vendor.fullName,
    businessName: vendor.businessName,
    email: vendor.email,
    phone: vendor.phone,
    address: vendor.address,
    role: vendor.role,
    isActive: vendor.isActive,
    createdAt: vendor.createdAt
  };
}

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export async function registerVendor(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      fullName,
      businessName,
      email,
      phone,
      address,
      password
    } = req.body;

    if (
      !fullName ||
      !businessName ||
      !email ||
      !phone ||
      !address ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "All required fields must be provided."
      });
      return;
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanPhone = String(phone).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
      return;
    }

    if (!/^9[678]\d{8}$/.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid Nepal mobile number."
      });
      return;
    }

    if (String(password).length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long."
      });
      return;
    }

    const existingEmail = await Vendor.findOne({
      email: cleanEmail
    });

    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: "A vendor account with this email already exists."
      });
      return;
    }

    const existingPhone = await Vendor.findOne({
      phone: cleanPhone
    });

    if (existingPhone) {
      res.status(409).json({
        success: false,
        message: "A vendor account with this phone number already exists."
      });
      return;
    }

    const hashedPassword = await hashPassword(
      String(password)
    );

    const vendor = await Vendor.create({
      fullName: String(fullName).trim(),
      businessName: String(businessName).trim(),
      email: cleanEmail,
      phone: cleanPhone,
      address: String(address).trim(),
      password: hashedPassword,
      role: "vendor",
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Vendor account created successfully.",
      vendor: sanitizeVendor(vendor)
    });
  } catch (error) {
    console.error("Vendor registration error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create vendor account."
    });
  }
}

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export async function loginVendor(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      email,
      password,
      remember
    } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
      return;
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const vendor = await Vendor.findOne({
      email: cleanEmail
    }).select("+password");

    if (!vendor) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }

    if (!vendor.isActive) {
      res.status(403).json({
        success: false,
        message: "This vendor account is inactive."
      });
      return;
    }

    const passwordMatches = await comparePassword(
      String(password),
      vendor.password
    );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }

    const shouldRemember = Boolean(remember);

    const token = createVendorToken(
      String(vendor._id),
      shouldRemember
    );

    res.cookie(
      getCookieName(),
      token,
      getCookieOptions(shouldRemember)
    );

    res.status(200).json({
      success: true,
      message: "Vendor login successful.",
      vendor: sanitizeVendor(vendor)
    });
  } catch (error) {
    console.error("Vendor login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to sign in."
    });
  }
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export async function logoutVendor(
  req: Request,
  res: Response
): Promise<void> {
  res.clearCookie(
    getCookieName(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      path: "/"
    }
  );

  res.status(200).json({
    success: true,
    message: "Vendor logged out successfully."
  });
}

/*
|--------------------------------------------------------------------------
| CURRENT VENDOR
|--------------------------------------------------------------------------
*/

export async function getCurrentVendor(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.vendorId) {
      res.status(401).json({
        success: false,
        message: "Authentication required."
      });
      return;
    }

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor account not found."
      });
      return;
    }

    if (!vendor.isActive) {
      res.status(403).json({
        success: false,
        message: "Vendor account is inactive."
      });
      return;
    }

    res.status(200).json({
      success: true,
      vendor: sanitizeVendor(vendor)
    });
  } catch (error) {
    console.error("Get current vendor error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load vendor account."
    });
  }
}

/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/


export async function forgotVendorPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
      return;
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const vendor = await Vendor.findOne({
      email: cleanEmail,
    }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );

    // Always return the same response so that
    // we don't reveal whether an email exists.
    if (!vendor) {
      res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, password reset instructions have been sent.",
      });
      return;
    }

    // Generate secure random token.
    const rawToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Store only the hashed token in MongoDB.
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    vendor.resetPasswordToken = hashedToken;

    // Token expires after 15 minutes.
    vendor.resetPasswordExpires =
      new Date(Date.now() + 15 * 60 * 1000);

    await vendor.save();

    // Frontend URL.
    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:3000";

    // IMPORTANT:
    // Send the RAW token to the user.
    // MongoDB stores only the hashed version.
    const resetUrl =
      `${frontendUrl}/vendor/reset-password?token=${encodeURIComponent(rawToken)}`;

    try {
      await sendVendorPasswordResetEmail(
        cleanEmail,
        resetUrl
      );

      console.log(
        `Password reset email sent to ${cleanEmail}`
      );
    } catch (emailError) {
      console.error(
        "Password reset email failed:",
        emailError
      );

      // Remove token if email could not be sent.
      vendor.resetPasswordToken = undefined;
      vendor.resetPasswordExpires = undefined;

      await vendor.save();

      res.status(500).json({
        success: false,
        message:
          "Unable to send password reset email. Please try again later.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, password reset instructions have been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request.",
    });
  }
}


/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

export async function resetVendorPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message:
          "Reset token and new password are required.",
      });
      return;
    }

    if (String(password).length < 8) {
      res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long.",
      });
      return;
    }

    /*
     * Hash the token received from the frontend.
     */
    const hashedToken = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");

    /*
     * Find vendor using:
     * 1. matching hashed token
     * 2. non-expired token
     */
    const vendor = await Vendor.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    }).select(
      "+password +resetPasswordToken +resetPasswordExpires"
    );

    if (!vendor) {
      res.status(400).json({
        success: false,
        message:
          "Password reset token is invalid or has expired.",
      });
      return;
    }

    /*
     * Hash and save the new password.
     */
    vendor.password = await hashPassword(
      String(password)
    );

    /*
     * Invalidate the reset token immediately.
     */
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpires = undefined;

    await vendor.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to reset password.",
    });
  }
}
