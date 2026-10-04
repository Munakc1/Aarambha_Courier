import express from "express";
import { validateEmail } from "@lacspace/email-validate";
import { asyncHandler, HttpError } from "../http.js";
import { sendWelcome } from "../mail/mailer.js";

const router = express.Router();

// POST /email/test — send a sample welcome email (validates the address first).
router.post("/test", asyncHandler(async (req, res) => {
  const to = String((req.body ?? {}).to ?? "").trim();
  const check = validateEmail(to);
  if (!check.valid) throw new HttpError(400, check.reason ?? "Invalid email address");
  const result = await sendWelcome(check.normalized ?? to);
  res.json({ ok: true, messageId: result.messageId });
}));

export default router;
