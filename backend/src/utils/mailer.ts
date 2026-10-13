// import {
//   createTransport,
//   mailerFromEnv,
//   type Transport,
// } from "@lacspace/mailer";

// import {
//   passwordResetEmail,
//   toPlainText,
// } from "@lacspace/email-templates";

// let transport: Transport | null = null;

// function getTransport(): Transport {
//   if (!transport) {
//     transport = createTransport(mailerFromEnv());
//   }

//   return transport;
// }

// export async function sendVendorPasswordResetEmail(
//   email: string,
//   resetUrl: string
// ): Promise<void> {
//   const message = passwordResetEmail({
//     resetUrl,
//   });

//   const mailer = getTransport();

//   await mailer.send({
//     from: process.env.SMTP_FROM,
//     to: email,
//     subject: message.subject,
//     html: message.html,
//     text: toPlainText(message.html),
//   });
// }