import express from "express";
import { hash, verify as verifyPassword } from "@lacspace/password";
import { setupTotp, verifyTotp, generateBackupCodes, verifyBackupCode } from "@lacspace/otp";
import { v } from "@lacspace/validate";
import { asyncHandler, HttpError } from "../http.js";
import { User } from "../models/user.js";
import { TwoFactor } from "../models/two-factor.js";

// This whole group is mounted behind requireAuth (see routes/index.ts), so
// req.user is always set here.
const router = express.Router();
const ISSUER = "ammrambha_courier";

const ProfileInput = v.object({ name: v.string().min(2).max(80) });
const PasswordInput = v.object({ currentPassword: v.string().min(1), newPassword: v.string().min(8).max(200) });
const CodeInput = v.object({ code: v.string().min(6).max(12) });

// GET /account/2fa — is two-factor enabled?
router.get("/2fa", asyncHandler(async (req, res) => {
  const tf = await TwoFactor.findOne({ userId: req.user!.sub });
  res.json({ enabled: Boolean(tf?.enabled) });
}));

// PATCH /account/profile — update your display name.
router.patch("/profile", asyncHandler(async (req, res) => {
  const { name } = ProfileInput.parse(req.body);
  const user = await User.findByIdAndUpdate(req.user!.sub, { $set: { name } }, { new: true });
  if (!user) throw new HttpError(404, "User not found");
  res.json({ id: String(user._id), name: user.name, email: user.email });
}));

// POST /account/password — change your password (verifies the current one).
router.post("/password", asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = PasswordInput.parse(req.body);
  const user = await User.findById(req.user!.sub);
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new HttpError(401, "Current password is incorrect");
  }
  user.passwordHash = await hash(newPassword);
  await user.save();
  res.json({ ok: true });
}));

// POST /account/2fa/setup — create a TOTP secret; show `uri` as a QR / `secret` to type.
router.post("/2fa/setup", asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.sub);
  if (!user) throw new HttpError(404, "User not found");
  const { secret, uri } = setupTotp({ account: user.email, issuer: ISSUER });
  await TwoFactor.findOneAndUpdate(
    { userId: String(user._id) },
    { $set: { secret, enabled: false } },
    { upsert: true, new: true },
  );
  res.json({ secret, uri });
}));

// POST /account/2fa/enable — verify a code, turn 2FA on, return one-time backup codes.
router.post("/2fa/enable", asyncHandler(async (req, res) => {
  const { code } = CodeInput.parse(req.body);
  const tf = await TwoFactor.findOne({ userId: req.user!.sub });
  if (!tf) throw new HttpError(400, "Run 2FA setup first");
  if ((await verifyTotp(code, tf.secret, { window: 1 })) === null) throw new HttpError(401, "Invalid code");
  const { codes, hashes } = await generateBackupCodes(10);
  tf.enabled = true;
  tf.backupHashes = hashes;
  await tf.save();
  res.json({ enabled: true, backupCodes: codes });
}));

// POST /account/2fa/disable — verify a TOTP or backup code, then turn 2FA off.
router.post("/2fa/disable", asyncHandler(async (req, res) => {
  const { code } = CodeInput.parse(req.body);
  const tf = await TwoFactor.findOne({ userId: req.user!.sub });
  if (!tf || !tf.enabled) { res.json({ enabled: false }); return; }
  const ok = (await verifyTotp(code, tf.secret, { window: 1 })) !== null || (await verifyBackupCode(code, tf.backupHashes)) >= 0;
  if (!ok) throw new HttpError(401, "Invalid code");
  await TwoFactor.deleteOne({ userId: req.user!.sub });
  res.json({ enabled: false });
}));

export default router;
