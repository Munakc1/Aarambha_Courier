import mongoose from "mongoose";
import { uuidv7 } from "@lacspace/id";

// how this works: the User fields. _id is a time-sortable UUID (@lacspace/id)
// instead of an ObjectId, so ids are readable and orderable. We store only a
// password HASH, never the raw password. (We DON'T extend mongoose.Document — that
// would force _id to be an ObjectId; a plain interface lets _id be our string.)
export interface UserDoc {
  _id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    _id: { type: String, default: () => uuidv7() },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User =
  (mongoose.models.User as mongoose.Model<UserDoc>) ?? mongoose.model<UserDoc>("User", userSchema);
