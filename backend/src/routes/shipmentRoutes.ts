
// import { Router, type Request, type Response } from "express";
// import { randomBytes } from "node:crypto";
// import mongoose from "mongoose";
// import Shipment from "../models/Shipment.js";
// import { vendorAuth } from "../middleware/vendorAuth.js";

// const router = Router();

// type AuthenticatedRequest = Request & {
//   vendor?: {
//     _id?: string;
//     id?: string;
//     vendorId?: string;
//   };
// };

// const NEPALI_PHONE_PATTERN = /^9[678]\d{8}$/;

// function text(value: unknown): string {
//   return typeof value === "string" ? value.trim() : "";
// }

// function validPhone(value: string): boolean {
//   return NEPALI_PHONE_PATTERN.test(value);
// }

// router.post(
//   "/",
//   vendorAuth,
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const authenticatedRequest = req as AuthenticatedRequest;
//       const vendor = authenticatedRequest.vendor;
//       const vendorId = vendor?._id ?? vendor?.id ?? vendor?.vendorId;

//       if (!vendorId || !mongoose.isValidObjectId(vendorId)) {
//         res.status(401).json({
//           success: false,
//           message: "Please log in to create a shipment.",
//         });
//         return;
//       }

//       const body = req.body ?? {};

//       const senderName = text(body.senderName);
//       const senderPhone = text(body.senderPhone);
//       const senderAddress = text(body.senderAddress);
//       const senderCity = text(body.senderCity);

//       const receiverName = text(body.receiverName);
//       const receiverPhone = text(body.receiverPhone);
//       const receiverAddress = text(body.receiverAddress);
//       const receiverCity = text(body.receiverCity);

//       const description = text(body.description);
//       const notes = text(body.notes);
//       const weight = Number(body.weight);
//       const parcelValue = Number(body.parcelValue);
//       const shippingFee = Number(body.shippingFee);
//       const paymentMethod = text(body.paymentMethod).toUpperCase();

//       const required: Record<string, string> = {
//         senderName,
//         senderPhone,
//         senderAddress,
//         senderCity,
//         receiverName,
//         receiverPhone,
//         receiverAddress,
//         receiverCity,
//         description,
//       };

//       const missing = Object.entries(required)
//         .filter(([, value]) => !value)
//         .map(([key]) => key);

//       if (missing.length) {
//         res.status(400).json({
//           success: false,
//           message: `Required fields are missing: ${missing.join(", ")}.`,
//         });
//         return;
//       }

//       if (!validPhone(senderPhone) || !validPhone(receiverPhone)) {
//         res.status(400).json({
//           success: false,
//           message: "Both phone numbers must be valid 10-digit Nepal mobile numbers.",
//         });
//         return;
//       }

//       if (!Number.isFinite(weight) || weight <= 0) {
//         res.status(400).json({
//           success: false,
//           message: "Weight must be greater than zero.",
//         });
//         return;
//       }

//       if (!Number.isFinite(parcelValue) || parcelValue < 0) {
//         res.status(400).json({
//           success: false,
//           message: "Parcel value must be zero or greater.",
//         });
//         return;
//       }

//       if (!Number.isFinite(shippingFee) || shippingFee <= 0) {
//         res.status(400).json({
//           success: false,
//           message: "Shipping fee must be greater than zero.",
//         });
//         return;
//       }

//       if (!["COD", "ESEWA"].includes(paymentMethod)) {
//         res.status(400).json({
//           success: false,
//           message: "Payment method must be COD or ESEWA.",
//         });
//         return;
//       }

//       const trackingNumber =
//         `ARC${Date.now().toString(36).toUpperCase()}` +
//         randomBytes(3).toString("hex").toUpperCase();

//       const shipment = await Shipment.create({
//         vendorId,
//         trackingNumber,
//         senderName,
//         senderPhone,
//         senderAddress,
//         senderCity,
//         receiverName,
//         receiverPhone,
//         receiverAddress,
//         receiverCity,
//         description,
//         weight,
//         parcelValue,
//         shippingFee,
//         notes,
//         paymentMethod,
//         paymentStatus:
//           paymentMethod === "COD" ? "NOT_REQUIRED" : "PENDING",
//         codAmount: paymentMethod === "COD" ? parcelValue : 0,
//         codStatus: paymentMethod === "COD" ? "PENDING" : "NOT_APPLICABLE",
//         status: "PENDING",
//       });

//       res.status(201).json({
//         success: true,
//         message: "Shipment created successfully.",
//         shipment: {
//           id: shipment._id.toString(),
//           _id: shipment._id.toString(),
//           trackingNumber: shipment.trackingNumber,
//           status: shipment.status,
//           paymentMethod: shipment.paymentMethod,
//           paymentStatus: shipment.paymentStatus,
//           shippingFee: shipment.shippingFee,
//           codAmount: shipment.codAmount,
//           codStatus: shipment.codStatus,
//         },
//       });
//     } catch (error) {
//       console.error("Create shipment error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Unable to create shipment.",
//       });
//     }
//   },
// );

// export default router;
