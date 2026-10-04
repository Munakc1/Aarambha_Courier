import mongoose from "mongoose";
import { uuidv7 } from "@lacspace/id";

export interface OrderDoc {
  _id: string;
  userId: string;
  label: string;
  amountPaisa: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  gateway: string;
  ref: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<OrderDoc>(
  {
    _id: { type: String, default: () => uuidv7() },
    userId: { type: String, required: true, index: true },
    label: { type: String, required: true },
    amountPaisa: { type: Number, required: true },
    currency: { type: String, default: "NPR" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    gateway: { type: String, default: "" },
    ref: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Order =
  (mongoose.models.Order as mongoose.Model<OrderDoc>) ?? mongoose.model<OrderDoc>("Order", schema);
