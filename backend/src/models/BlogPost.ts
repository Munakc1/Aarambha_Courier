
import { Schema, model, models } from "mongoose";

export const BLOG_CATEGORIES = [
  "Courier Tips",
  "E-commerce Logistics",
  "COD Guidance",
  "Packaging Tips",
  "Delivery Updates",
  "Aarambha News",
] as const;

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    excerpt: { type: String, required: true, trim: true, maxlength: 400 },
    content: { type: String, required: true, maxlength: 100000 },
    category: {
      type: String,
      required: true,
      enum: BLOG_CATEGORIES,
    },
    imageMediaId: {
      type: Schema.Types.ObjectId,
      ref: "BlogMedia",
      default: null,
    },
    externalImageUrl: { type: String, default: null },
    imageAlt: { type: String, required: true, trim: true, maxlength: 250 },
    readTime: { type: Number, required: true, min: 1, default: 1 },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
      index: true,
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });

export default models.BlogPost || model("BlogPost", blogPostSchema);
