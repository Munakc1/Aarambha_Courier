
import {
  createTransport,
  mailerFromEnv,
  type Mail,
  type SendResult,
  type Transport,
} from "@lacspace/mailer";

import {
  passwordResetEmail,
  toPlainText,
} from "@lacspace/email-templates";

let transport: Transport | null = null;

function getTransport(): Transport {
  if (!transport) {
    transport = createTransport(mailerFromEnv());
  }

  return transport;
}

export async function sendVendorPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const message = passwordResetEmail({
    resetUrl,
  });

  const mailer = getTransport();

  await mailer.send({
    from:
      process.env.MAIL_FROM ||
      process.env.SMTP_USER ||
      "Aarambha Courier <kcm02051@gmail.com>",
    to: email,
    subject: "Reset your Aarambha Courier password",
    html: message,
    text: toPlainText(message),
  });
}

export default async function sendEmail(
  mail: Omit<Mail, "from"> & { from?: Mail["from"] }
): Promise<SendResult> {
  const mailer = getTransport();

  return mailer.send({
    from:
      process.env.MAIL_FROM ||
      process.env.SMTP_USER ||
      "kcm02051@gmail.com",
    ...mail,
  });
}
