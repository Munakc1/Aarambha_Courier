import { Router } from "express";

import {
  registerVendor,
  loginVendor,
  logoutVendor,
  getCurrentVendor,
  forgotVendorPassword,
  resetVendorPassword
} from "../controllers/vendorController.js";

import {
  requireVendorAuth
} from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/register",
  registerVendor
);

router.post(
  "/login",
  loginVendor
);

router.post(
  "/logout",
  logoutVendor
);

router.get(
  "/me",
  requireVendorAuth,
  getCurrentVendor
);

router.post(
  "/forgot-password",
  forgotVendorPassword
);

router.post(
  "/reset-password/:token",
  resetVendorPassword
);


export default router;