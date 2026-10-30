import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVendor extends Document {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  password: string;

  role: "vendor";

  isActive: boolean;
  emailVerified: boolean;

  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["vendor"],
      default: "vendor",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // EMAIL VERIFICATION
    // ==========================================

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // ==========================================
    // PASSWORD RESET
    // ==========================================

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor: Model<IVendor> =
  mongoose.models.Vendor ||
  mongoose.model<IVendor>("Vendor", vendorSchema);

export default Vendor;