
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Vendor } from "../models/Vendor.js";

type AuthRequest = Request & {
  vendorId?: string;
};

const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const BUSINESS_TYPES = [
  "Retail",
  "Wholesale",
  "Manufacturer",
  "Distributor",
  "E-commerce",
  "Other",
];

const editableFields = [
  "businessName",
  "businessType",
  "registrationNumber",
  "address",
  "city",
  "province",
  "postalCode",
  "description",
] as const;

function serializeProfile(vendor: any) {
  return {
    contactName: vendor.fullName ?? "",
    businessName: vendor.businessName ?? "",
    email: vendor.email ?? "",
    phone: vendor.phone ?? "",
    businessType: vendor.businessType || "Other",
    registrationNumber: vendor.registrationNumber ?? "",
    address: vendor.address ?? "",
    city: vendor.city ?? "",
    province: vendor.province ?? "",
    postalCode: vendor.postalCode ?? "",
    description: vendor.description ?? "",
  };
}

function sendError(
  res: Response,
  status: number,
  message: string,
) {
  return res.status(status).json({
    success: false,
    message,
  });
}

// GET /api/vendor/profile
export async function getVendorProfile(
  req: AuthRequest,
  res: Response,
) {
  try {
    const vendorId = req.vendorId;

    if (!vendorId || !isValidObjectId(vendorId)) {
      return sendError(res, 401, "Please log in again.");
    }

    const vendor = await Vendor.findById(vendorId)
      .select(
        "fullName businessName email phone businessType registrationNumber address city province postalCode description",
      )
      .lean();

    if (!vendor) {
      return sendError(res, 404, "Vendor account not found.");
    }

    return res.status(200).json({
      success: true,
      profile: serializeProfile(vendor),
    });
  } catch (error) {
    console.error("Get vendor profile error:", error);
    return sendError(
      res,
      500,
      "Unable to load your profile. Please try again.",
    );
  }
}

// PATCH /api/vendor/profile
export async function updateVendorProfile(
  req: AuthRequest,
  res: Response,
) {
  try {
    const vendorId = req.vendorId;

    if (!vendorId || !isValidObjectId(vendorId)) {
      return sendError(res, 401, "Please log in again.");
    }

    const body = req.body;

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return sendError(res, 400, "Invalid profile data.");
    }

    const updates: Record<string, string> = {};

    // Map frontend contactName to the model's fullName field.
    if (body.contactName !== undefined) {
      if (typeof body.contactName !== "string") {
        return sendError(res, 400, "Invalid contact person.");
      }

      const name = body.contactName.trim();

      if (!name || name.length > 150) {
        return sendError(
          res,
          400,
          "Contact person must be between 1 and 150 characters.",
        );
      }

      updates.fullName = name;
    }

    if (body.businessName !== undefined) {
      if (typeof body.businessName !== "string") {
        return sendError(res, 400, "Invalid business name.");
      }

      const name = body.businessName.trim();

      if (!name || name.length > 150) {
        return sendError(
          res,
          400,
          "Business name is required and must not exceed 150 characters.",
        );
      }

      updates.businessName = name;
    }

    if (body.email !== undefined) {
      if (typeof body.email !== "string") {
        return sendError(res, 400, "Invalid email address.");
      }

      const email = body.email.trim().toLowerCase();

      if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return sendError(res, 400, "Enter a valid email address.");
      }

      updates.email = email;
    }

    if (body.phone !== undefined) {
      if (typeof body.phone !== "string") {
        return sendError(res, 400, "Invalid phone number.");
      }

      const phone = body.phone.trim();

      if (!/^9[678]\d{8}$/.test(phone)) {
        return sendError(
          res,
          400,
          "Enter a valid 10-digit Nepal mobile number.",
        );
      }

      updates.phone = phone;
    }

    for (const field of editableFields) {
      if (body[field] === undefined) continue;

      if (typeof body[field] !== "string") {
        return sendError(
          res,
          400,
          `Invalid value for ${field}.`,
        );
      }

      updates[field] = body[field].trim();
    }

    if (
      updates.businessType !== undefined &&
      !BUSINESS_TYPES.includes(updates.businessType)
    ) {
      return sendError(res, 400, "Select a valid business type.");
    }

    if (
      updates.registrationNumber !== undefined &&
      updates.registrationNumber.length > 100
    ) {
      return sendError(
        res,
        400,
        "Registration number must not exceed 100 characters.",
      );
    }

    if (
      updates.address !== undefined &&
      (!updates.address || updates.address.length > 250)
    ) {
      return sendError(
        res,
        400,
        "Street / area is required and must not exceed 250 characters.",
      );
    }

    if (
      updates.city !== undefined &&
      (!updates.city || updates.city.length > 100)
    ) {
      return sendError(
        res,
        400,
        "City is required and must not exceed 100 characters.",
      );
    }

    if (
      updates.province !== undefined &&
      !PROVINCES.includes(updates.province)
    ) {
      return sendError(res, 400, "Select a valid province.");
    }

    if (
      updates.postalCode !== undefined &&
      updates.postalCode.length > 20
    ) {
      return sendError(
        res,
        400,
        "Postal code must not exceed 20 characters.",
      );
    }

    if (
      updates.description !== undefined &&
      updates.description.length > 1000
    ) {
      return sendError(
        res,
        400,
        "Description must not exceed 1000 characters.",
      );
    }

    // Require all mandatory profile fields to be complete
    // before saving, while allowing partial PATCH requests.
    const current = await Vendor.findById(vendorId);

    if (!current) {
      return sendError(res, 404, "Vendor account not found.");
    }

    const finalValue = (key: string) =>
      updates[key] !== undefined
        ? updates[key]
        : key === "contactName"
          ? current.get("fullName")
          : current.get(key);

    const requiredFields = [
      ["contactName", "Contact person"],
      ["businessName", "Business name"],
      ["email", "Email address"],
      ["phone", "Mobile number"],
      ["address", "Street / area"],
      ["city", "City"],
      ["province", "Province"],
    ] as const;

    for (const [key, label] of requiredFields) {
      const value = finalValue(key);

      if (typeof value !== "string" || !value.trim()) {
        return sendError(res, 400, `${label} is required.`);
      }
    }

    // Check whether another vendor already uses this email or phone.
    const duplicateConditions: Record<string, string>[] = [];

    if (updates.email !== undefined) {
      duplicateConditions.push({ email: updates.email });
    }

    if (updates.phone !== undefined) {
      duplicateConditions.push({ phone: updates.phone });
    }

    if (duplicateConditions.length > 0) {
      const duplicate = await Vendor.findOne({
        _id: { $ne: vendorId },
        $or: duplicateConditions,
      }).select("email phone");

      if (duplicate) {
        if (
          updates.email !== undefined &&
          duplicate.email === updates.email
        ) {
          return sendError(
            res,
            409,
            "This email is already registered.",
          );
        }

        if (
          updates.phone !== undefined &&
          duplicate.phone === updates.phone
        ) {
          return sendError(
            res,
            409,
            "This phone number is already registered.",
          );
        }

        return sendError(
          res,
          409,
          "Email or phone number is already in use.",
        );
      }
    }

    // Update only allowlisted fields on the authenticated vendor.
    for (const [key, value] of Object.entries(updates)) {
      current.set(key, value);
    }

    await current.save();

    return res.status(200).json({
      success: true,
      message: "Your profile was saved successfully.",
      profile: serializeProfile(current),
    });
  } catch (error: any) {
    // MongoDB unique-index conflicts can still occur during a race.
    if (error?.code === 11000) {
      return sendError(
        res,
        409,
        "Email or phone number is already registered.",
      );
    }

    console.error("Update vendor profile error:", error);

    return sendError(
      res,
      500,
      "Unable to save your profile. Please try again.",
    );
  }
}
 