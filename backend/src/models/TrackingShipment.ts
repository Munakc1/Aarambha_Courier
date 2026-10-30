
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const trackingEventSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: null,
      trim: true,
    },
    occurredAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const trackingShipmentSchema = new Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      required: true,
      default: "CREATED",
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      default: null,
      trim: true,
    },
    events: {
      type: [trackingEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "tracking_shipments",
  }
);

export type TrackingShipmentType = InferSchemaType<
  typeof trackingShipmentSchema
>;

const TrackingShipment =
  (mongoose.models.TrackingShipment as
    | mongoose.Model<TrackingShipmentType>
    | undefined) ??
  mongoose.model<TrackingShipmentType>(
    "TrackingShipment",
    trackingShipmentSchema
  );

export default TrackingShipment;
