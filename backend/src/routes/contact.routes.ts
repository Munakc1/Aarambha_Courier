import { Router, type Request, type Response } from "express";
import Contact from "../models/contact.model";

const router = Router();

const inquiryTypes = [
  "General Courier",
  "Vendor Inquiry",
  "Domestic Courier",
  "International Courier",
  "Pickup Request",
  "COD",
  "Exchange/Return",
];

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      type,
      business,
      message,
    } = req.body ?? {};

    // Required fields
    if (
      typeof name !== "string" ||
      typeof phone !== "string" ||
      typeof type !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, inquiry type, and message are required.",
      });
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanBusiness =
      typeof business === "string" ? business.trim() : "";
    const cleanMessage = message.trim();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name (maximum 100 characters).",
      });
    }

    // Accept Nepal mobile numbers and international phone formats.
    if (!/^\+?[0-9][0-9\s()-]{6,18}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Email address is too long.",
      });
    }

    if (!inquiryTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid inquiry type.",
      });
    }

    if (!cleanMessage || cleanMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be under 5000 characters.",
      });
    }

    if (cleanBusiness.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Business name must be under 150 characters.",
      });
    }

    // Save inquiry to MongoDB.
    const inquiry = await Contact.create({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || undefined,
      type,
      business: cleanBusiness || undefined,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      data: {
        id: inquiry._id,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("Create contact inquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save your inquiry. Please try again.",
    });
  }
});

// Optional endpoint to check that the contact route is mounted.
router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Contact API is working.",
  });
});

export default router;