"use server";
import { createForm } from "@lacspace/form";
import { v } from "@lacspace/validate";

const contact = createForm({
  schema: v.object({
    name: v.string().min(2, "Please tell us your name").trim(),
    email: v.string().email("Enter a valid email").toLowerCase(),
    message: v.string().min(10, "A little more detail, please"),
  }),
  honeypot: "company", // bots fill this hidden field; humans never see it
  minSubmitMs: 800,     // reject sub-second (bot-speed) submissions
});

export type ContactState =
  | { ok: true }
  | { ok: false; errors: Record<string, string>; values: Record<string, unknown> }
  | null;

export async function submitContact(prev: ContactState, formData: FormData): Promise<ContactState> {
  const r = contact.action(prev, formData);
  if (!r.ok) return r;

  // ✅ r.data is fully typed: { name, email, message }
  // TODO: send it with @lacspace/mailer, or save it to your database.
  console.log("New contact message:", r.data);
  return { ok: true };
}

const newsletter = createForm({
  schema: v.object({ email: v.string().email("Enter a valid email").toLowerCase() }),
  honeypot: "website",
  minSubmitMs: 500,
});

export type SubscribeState =
  | { ok: true }
  | { ok: false; errors: Record<string, string>; values: Record<string, unknown> }
  | null;

export async function submitNewsletter(prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const r = newsletter.action(prev, formData);
  if (!r.ok) return r;

  // ✅ r.data is fully typed: { email }
  // TODO: add r.data.email to your list (Resend, Mailchimp, a database…).
  console.log("New subscriber:", r.data.email);
  return { ok: true };
}
