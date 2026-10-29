
import { Router } from "express";
import {
  createTrackingShipment,
  getTracking,
} from "../controllers/tracking.controller.js";

const router = Router();

// Create a shipment
router.post("/", createTrackingShipment);

// Track an existing shipment
router.get("/:trackingNumber", getTracking);

export default router;
