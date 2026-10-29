import mongoose, { Schema, type InferSchemaType } from "mongoose";

const inquiryTypes = [
  "General Courier",
  "Vendor Inquiry",
  "Domestic Courier",
  "International Courier",
  "Pickup Request",
  "COD",
  "Exchange/Return",
] as const;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    type: {
      type: String,
      enum: inquiryTypes,
      required: true,
    },

    business: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED"],
      default: "NEW",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type ContactInquiry = InferSchemaType<typeof contactSchema>;

const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);

export default Contact;