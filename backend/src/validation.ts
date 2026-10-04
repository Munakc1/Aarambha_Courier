import { v, type Infer } from "@lacspace/validate";

// how this works: Zod-like schemas (@lacspace/validate). .parse(body) throws a
// ValidationError on bad input, which the error middleware turns into a clean 400
// with per-field messages.
// Email is normalised HERE, not only in the schema. Mongoose applies
// `lowercase`/`trim` setters when it SAVES a document, but not to query
// filters — so `User.findOne({ email })` with "Bro@Gmail.com" would miss the
// stored "bro@gmail.com", and the account would be unreachable at login.
export const RegisterInput = v.object({
  name: v.string().min(2).max(80),
  email: v.string().email().trim().toLowerCase(),
  password: v.string().min(8).max(200),
});

export const LoginInput = v.object({
  email: v.string().email().trim().toLowerCase(),
  password: v.string().min(1),
});

export const NoteInput = v.object({
  title: v.string().min(1).max(200),
  body: v.string().max(10_000).default(""),
});

export type RegisterBody = Infer<typeof RegisterInput>;
export type LoginBody = Infer<typeof LoginInput>;
export type NoteBody = Infer<typeof NoteInput>;
