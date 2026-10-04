import mongoose from "mongoose";
import { uuidv7 } from "@lacspace/id";

// how this works: a separate collection for 2FA so the base User model stays simple.
// NOTE: the TOTP secret is stored as-is here — in production, encrypt it at rest with
// @lacspace/crypto (encrypt/decrypt) using a key from your env.
export interface TwoFactorDoc {
  _id: string;
  userId: string;
  secret: string;
  enabled: boolean;
  backupHashes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<TwoFactorDoc>(
  {
    _id: { type: String, default: () => uuidv7() },
    userId: { type: String, required: true, unique: true, index: true },
    secret: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    backupHashes: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const TwoFactor =
  (mongoose.models.TwoFactor as mongoose.Model<TwoFactorDoc>) ?? mongoose.model<TwoFactorDoc>("TwoFactor", schema);
