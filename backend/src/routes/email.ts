
import express from "express";
import { validateEmail } from "@lacspace/email-validate";
import { asyncHandler, HttpError } from "../http.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/**
 * POST /email/test
 * Validates the recipient and sends a test email.
 */
router.post(
  "/test",
  asyncHandler(async (req, res) => {
    const to = String(req.body?.to ?? "").trim();

    const check = validateEmail(to);

    if (!check.valid) {
      throw new HttpError(
        400,
        check.reason ?? "Invalid email address"
      );
    }

    const recipient = check.normalized ?? to;

    const result = await sendEmail({
      to: recipient,
      subject: "Aarambha Courier - Email Test",
      text: [
        "Hello,",
        "",
        "Your Aarambha Courier email configuration is working.",
        "",
        "This is a test email from your application.",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; color: #141B22;">
          <h2>Aarambha Courier</h2>
          <p>Your email configuration is working.</p>
          <p>This is a test email from your application.</p>
        </div>
      `,
    });

    res.status(200).json({
      ok: true,
      message: "Test email sent successfully.",
      messageId: result.messageId,
    });
  })
);

export default router;
