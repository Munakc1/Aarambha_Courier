
import mongoose, { Schema } from "mongoose";

const shipmentSchema = new Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shippingFee: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ESEWA"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "NOT_REQUIRED"],
      default: "PENDING",
    },

    esewaTransactionUuid: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Shipment ||
  mongoose.model("Shipment", shipmentSchema);
