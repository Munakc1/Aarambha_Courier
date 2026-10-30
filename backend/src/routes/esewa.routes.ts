
import { Router } from "express";
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
} from "../controllers/esewa.controller.js";

// Adjust this import path to your existing middleware file.
import { requireVendorAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/initiate", requireVendorAuth, initiateEsewaPayment);

// eSewa must be able to redirect back without the vendor login cookie.
router.get("/verify", verifyEsewaPayment);

export default router;
