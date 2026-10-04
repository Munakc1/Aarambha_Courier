import mongoose from "mongoose";
import { uuidv7 } from "@lacspace/id";

// how this works: the example CRUD resource. Rename "Note" to your real domain
// object (Task, Post, Product…) and add fields — the routes follow the same shape.
// (Plain interface, not mongoose.Document, so _id can be our string UUID.)
export interface NoteDoc {
  _id: string;
  title: string;
  body: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema<NoteDoc>(
  {
    _id: { type: String, default: () => uuidv7() },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "" },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

export const Note =
  (mongoose.models.Note as mongoose.Model<NoteDoc>) ?? mongoose.model<NoteDoc>("Note", noteSchema);
