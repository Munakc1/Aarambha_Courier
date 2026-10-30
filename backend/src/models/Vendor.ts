
import { Schema, model, models, type Model } from "mongoose";

export const BUSINESS_TYPES = [
  "Retail",
  "Wholesale",
  "Manufacturer",
  "Distributor",
  "E-commerce",
  "Other",
] as const;

export const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
] as const;

export interface IVendor {
  name: string;
  contactName: string;
  businessName: string;
  email: string;
  phone: string;
  passwordHash: string;
  businessType: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  description: string;
  status: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    name: { type: String, trim: true, default: "" },
    contactName: { type: String, trim: true, default: "" },
    businessName: { type: String, trim: true, default: "" },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // Keep the field name consistent with your existing login code.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    businessType: {
      type: String,
      enum: BUSINESS_TYPES,
      default: "Other",
    },

    registrationNumber: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    province: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, maxlength: 1000, default: "" },

    status: { type: String, default: "ACTIVE" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Vendor: Model<IVendor> =
  (models.Vendor as Model<IVendor>) ||
  model<IVendor>("Vendor", vendorSchema);

export default Vendor;
