
import { Schema, model, models } from "mongoose";

const blogMediaSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    },
    size: {
      type: Number,
      required: true,
      min: 1,
      max: 5 * 1024 * 1024,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.BlogMedia ||
  model("BlogMedia", blogMediaSchema);
