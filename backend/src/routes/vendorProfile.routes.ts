
import { Router, type Response } from "express";
import { isValidObjectId } from "mongoose";
import { Vendor } from "../models/Vendor.js";
import {
  requireVendorAuth,
  type VendorRequest,
} from "../middleware/vendorProfileAuth.js";

const router = Router();

const allowedBusinessTypes = [
  "Retail",
  "Wholesale",
  "Manufacturer",
  "Distributor",
  "E-commerce",
  "Other",
];

const allowedProvinces = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const phoneRegex = /^9[678]\d{8}$/;

const profileFields = [
  "contactName",
  "businessName",
  "email",
  "phone",
  "businessType",
  "registrationNumber",
  "address",
  "city",
  "province",
  "postalCode",
  "description",
] as const;

function sendProfile(res: Response, vendor: any, message?: string) {
  const profile = {
    contactName: vendor.contactName || vendor.name || "",
    businessName: vendor.businessName || "",
    email: vendor.email || "",
    phone: vendor.phone || "",
    businessType: vendor.businessType || "Other",
    registrationNumber: vendor.registrationNumber || "",
    address: vendor.address || "",
    city: vendor.city || "",
    province: vendor.province || "",
    postalCode: vendor.postalCode || "",
    description: vendor.description || "",
  };

  return res.status(200).json({
    success: true,
    ...(message ? { message } : {}),
    profile,
  });
}

// GET /api/vendor/profile
router.get(
  "/",
  requireVendorAuth,
  async (req, res: Response) => {
    try {
      const { vendorId } = req as VendorRequest;

      if (!vendorId || !isValidObjectId(vendorId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid vendor session.",
        });
      }

      const vendor = await Vendor.findById(vendorId).lean();

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor account not found.",
        });
      }

      return sendProfile(res, vendor);
    } catch (error) {
      console.error("Get vendor profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to load your profile. Please try again.",
      });
    }
  },
);

// PATCH /api/vendor/profile
router.patch(
  "/",
  requireVendorAuth,
  async (req, res: Response) => {
    try {
      const { vendorId } = req as VendorRequest;

      if (!vendorId || !isValidObjectId(vendorId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid vendor session.",
        });
      }

      const body = req.body;

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({
          success: false,
          message: "Please provide valid profile information.",
        });
      }

      // Only permit profile fields. Never allow password, role,
      // status, verification, or other protected fields to be changed.
      const payload: Record<string, string> = {};

      for (const field of profileFields) {
        if (body[field] === undefined) continue;

        if (typeof body[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `Invalid value for ${field}.`,
          });
        }

        payload[field] = body[field].trim();
      }

      if (payload.contactName !== undefined) {
        if (!payload.contactName || payload.contactName.length > 100) {
          return res.status(400).json({
            success: false,
            message: "Contact person must be between 1 and 100 characters.",
          });
        }
      }

      if (payload.businessName !== undefined) {
        if (!payload.businessName || payload.businessName.length > 150) {
          return res.status(400).json({
            success: false,
            message: "Business name must be between 1 and 150 characters.",
          });
        }
      }

      if (payload.email !== undefined) {
        payload.email = payload.email.toLowerCase();

        if (
          payload.email.length > 254 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
        ) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid email address.",
          });
        }
      }

      if (payload.phone !== undefined && !phoneRegex.test(payload.phone)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid 10-digit Nepal mobile number.",
        });
      }

      if (
        payload.businessType !== undefined &&
        !allowedBusinessTypes.includes(payload.businessType)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid business type.",
        });
      }

      if (
        payload.province !== undefined &&
        !allowedProvinces.includes(payload.province)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid province.",
        });
      }

      if (
        payload.registrationNumber !== undefined &&
        payload.registrationNumber.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Registration number is too long.",
        });
      }

      if (
        payload.address !== undefined &&
        (!payload.address || payload.address.length > 250)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid street or area.",
        });
      }

      if (
        payload.city !== undefined &&
        (!payload.city || payload.city.length > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid city.",
        });
      }

      if (
        payload.postalCode !== undefined &&
        payload.postalCode.length > 20
      ) {
        return res.status(400).json({
          success: false,
          message: "Postal code is too long.",
        });
      }

      if (
        payload.description !== undefined &&
        payload.description.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message: "Description cannot exceed 1000 characters.",
        });
      }

      if (Object.keys(payload).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No profile changes were provided.",
        });
      }

      // Maintain compatibility with older records that use `name`.
      if (payload.contactName !== undefined) {
        payload.name = payload.contactName;
      }

      const update: Record<string, unknown> = { ...payload };

      const vendor = await Vendor.findByIdAndUpdate(
        vendorId,
        { $set: update },
        {
          new: true,
          runValidators: true,
        },
      ).lean();

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor account not found.",
        });
      }

      return sendProfile(
        res,
        vendor,
        "Your profile was saved successfully.",
      );
    } catch (error: any) {
      console.error("Update vendor profile error:", error);

      if (error?.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "This email address is already registered.",
        });
      }

      if (error?.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Some profile fields are invalid.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to save your profile. Please try again.",
      });
    }
  },
);

export default router;
