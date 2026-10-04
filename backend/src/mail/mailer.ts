import { createTransport, createJsonTransport, mailerFromEnv, type Transport } from "@lacspace/mailer";
import { welcomeEmail, verifyEmail, passwordResetEmail, toPlainText } from "@lacspace/email-templates";

// how this works: if SMTP_* env vars are set, it sends real email over SMTP; otherwise
// it logs the full message to the console (so the app runs with NO credentials). Adding
// SMTP_* later switches to real delivery with no code change.
export const transport: Transport = process.env.SMTP_HOST
  ? createTransport(mailerFromEnv())
  : createJsonTransport((json) => console.log("\n[email:dev] set SMTP_* in .env to deliver for real:\n" + json + "\n"));

const FROM = process.env.SMTP_FROM ?? "ammrambha_courier <no-reply@example.com>";
const brand = { brandName: "ammrambha_courier" };

export function sendWelcome(to: string, name?: string) {
  const html = welcomeEmail({ name, message: "Thanks for joining " + brand.brandName + "!", ...brand });
  return transport.send({ from: FROM, to, subject: "Welcome to " + brand.brandName, html, text: toPlainText(html) });
}
export function sendVerify(to: string, verifyUrl: string) {
  const html = verifyEmail({ verifyUrl, expiresMinutes: 30, ...brand });
  return transport.send({ from: FROM, to, subject: "Verify your email", html, text: toPlainText(html) });
}
export function sendReset(to: string, resetUrl: string) {
  const html = passwordResetEmail({ resetUrl, expiresMinutes: 30, ...brand });
  return transport.send({ from: FROM, to, subject: "Reset your password", html, text: toPlainText(html) });
}
