
// import { Router, Request, Response, NextFunction } from "express";
// import multer from "multer";
// import mongoose from "mongoose";
// import { timingSafeEqual } from "node:crypto";
// import { sign, verify } from "@lacspace/signed-url";
// import BlogPost, { BLOG_CATEGORIES } from "../models/BlogPost";
// import BlogMedia from "../models/BlogMedia";

// const router = Router();

// const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// const IMAGE_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
// const ALLOWED_MIME_TYPES = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ]);

// function requiredEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) throw new Error(`Missing required environment variable: ${name}`);
//   return value;
// }

// function slugify(value: string): string {
//   return value
//     .normalize("NFKD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "")
//     .slice(0, 190);
// }

// function estimateReadTime(content: string): number {
//   return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
// }

// function isValidExternalImageUrl(value: unknown): value is string {
//   if (typeof value !== "string" || value.length > 2048) return false;

//   try {
//     const url = new URL(value);
//     return url.protocol === "https:" || url.protocol === "http:";
//   } catch {
//     return false;
//   }
// }

// function adminOnly(req: Request, res: Response, next: NextFunction) {
//   const configuredKey = process.env.BLOG_ADMIN_API_KEY;
//   const suppliedKey = req.header("x-blog-admin-key");

//   if (!configuredKey || !suppliedKey) {
//     return res.status(401).json({
//       success: false,
//       message: "Admin authentication required.",
//     });
//   }

//   const expected = Buffer.from(configuredKey);
//   const actual = Buffer.from(suppliedKey);

//   if (
//     expected.length !== actual.length ||
//     !timingSafeEqual(expected, actual)
//   ) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid admin credentials.",
//     });
//   }

//   next();
// }

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: MAX_IMAGE_BYTES,
//     files: 1,
//   },
//   fileFilter: (_req, file, callback) => {
//     if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
//       return callback(new Error("Only JPEG, PNG, WebP, and GIF images are allowed."));
//     }
//     callback(null, true);
//   },
// });

// async function makeImageUrl(mediaId: unknown): Promise<string | null> {
//   if (!mediaId) return null;

//   const id = String(mediaId);
//   const token = await sign(
//     { mediaId: id, purpose: "blog-image" },
//     {
//       secret: requiredEnv("BLOG_MEDIA_SIGNING_SECRET"),
//       expiresIn: IMAGE_TOKEN_TTL_SECONDS,
//     }
//   );

//   const baseUrl = requiredEnv("API_PUBLIC_URL").replace(/\/+$/, "");

//   return `${baseUrl}/api/blog/media/${id}?token=${encodeURIComponent(token)}`;
// }

// async function serializePost(post: any) {
//   const image =
//     post.imageMediaId
//       ? await makeImageUrl(post.imageMediaId)
//       : post.externalImageUrl ?? null;

//   return {
//     id: String(post._id),
//     title: post.title,
//     slug: post.slug,
//     excerpt: post.excerpt,
//     content: post.content,
//     category: post.category,
//     image,
//     imageAlt: post.imageAlt,
//     readTime: post.readTime,
//     status: post.status,
//     publishedAt: post.publishedAt,
//     createdAt: post.createdAt,
//     updatedAt: post.updatedAt,
//   };
// }

// function validatePost(body: any, partial = false): string | null {
//   if (!body || typeof body !== "object" || Array.isArray(body)) {
//     return "A JSON object is required.";
//   }

//   const stringFields = [
//     ["title", 180],
//     ["excerpt", 400],
//     ["content", 100000],
//     ["imageAlt", 250],
//   ] as const;

//   for (const [field, maxLength] of stringFields) {
//     if (partial && body[field] === undefined) continue;

//     if (
//       typeof body[field] !== "string" ||
//       !body[field].trim() ||
//       body[field].length > maxLength
//     ) {
//       return `${field} is required and must be at most ${maxLength} characters.`;
//     }
//   }

//   if (
//     (!partial || body.category !== undefined) &&
//     !BLOG_CATEGORIES.includes(body.category)
//   ) {
//     return "A valid blog category is required.";
//   }

//   if (
//     body.status !== undefined &&
//     !["DRAFT", "PUBLISHED"].includes(body.status)
//   ) {
//     return "Status must be DRAFT or PUBLISHED.";
//   }

//   if (
//     body.imageMediaId !== undefined &&
//     body.imageMediaId !== null &&
//     !mongoose.isValidObjectId(body.imageMediaId)
//   ) {
//     return "imageMediaId must be a valid uploaded image ID.";
//   }

//   if (
//     body.image !== undefined &&
//     body.image !== null &&
//     !isValidExternalImageUrl(body.image)
//   ) {
//     return "image must be an HTTP(S) URL. For uploaded images, use imageMediaId.";
//   }

//   return null;
// }

// // Public: list published posts, with pagination, search, and category filters.
// router.get("/", async (req, res) => {
//   try {
//     const page = Math.max(1, Number.parseInt(String(req.query.page ?? "1"), 10) || 1);
//     const limit = Math.min(
//       50,
//       Math.max(1, Number.parseInt(String(req.query.limit ?? "9"), 10) || 9)
//     );

//     const filter: Record<string, any> = {
//       status: "PUBLISHED",
//     };

//     if (typeof req.query.category === "string" &&
//         req.query.category !== "All") {
//       if (!BLOG_CATEGORIES.includes(req.query.category as any)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid category.",
//         });
//       }
//       filter.category = req.query.category;
//     }

//     if (typeof req.query.search === "string" && req.query.search.trim()) {
//       const escaped = req.query.search.trim().slice(0, 100).replace(
//         /[.*+?^${}()|[\]\\]/g,
//         "\\$&"
//       );
//       filter.$or = [
//         { title: { $regex: escaped, $options: "i" } },
//         { excerpt: { $regex: escaped, $options: "i" } },
//         { content: { $regex: escaped, $options: "i" } },
//       ];
//     }

//     const [posts, total] = await Promise.all([
//       BlogPost.find(filter)
//         .sort({ publishedAt: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .lean(),
//       BlogPost.countDocuments(filter),
//     ]);

//     res.json({
//       success: true,
//       data: await Promise.all(posts.map(serializePost)),
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("List blog posts failed:", error);
//     res.status(500).json({ success: false, message: "Unable to load blog posts." });
//   }
// });

// // Public: individual published article.
// router.get("/post/:slug", async (req, res) => {
//   try {
//     const post = await BlogPost.findOne({
//       slug: req.params.slug,
//       status: "PUBLISHED",
//     }).lean();

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog post not found.",
//       });
//     }

//     res.json({ success: true, data: await serializePost(post) });
//   } catch (error) {
//     console.error("Get blog post failed:", error);
//     res.status(500).json({ success: false, message: "Unable to load this article." });
//   }
// });

// // Public: verify signed URL and stream the stored image.
// router.get("/media/:id", async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(404).json({ success: false, message: "Image not found." });
//     }

//     const token = typeof req.query.token === "string" ? req.query.token : "";
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Image token required." });
//     }

//     const result = await verify<{ mediaId: string; purpose: string }>(
//       token,
//       { secret: requiredEnv("BLOG_MEDIA_SIGNING_SECRET") }
//     );

//     if (
//       !result.valid ||
//       result.data.mediaId !== req.params.id ||
//       result.data.purpose !== "blog-image"
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Image link is invalid or expired. Reload the article to get a new link.",
//       });
//     }

//     const media = await BlogMedia.findById(req.params.id).lean();

//     if (!media) {
//       return res.status(404).json({ success: false, message: "Image not found." });
//     }

//     res.setHeader("Content-Type", media.mimeType);
//     res.setHeader("Content-Length", media.size);
//     res.setHeader("X-Content-Type-Options", "nosniff");
//     res.setHeader("Cache-Control", "private, max-age=300");
//     res.send(media.data);
//   } catch (error) {
//     console.error("Read blog image failed:", error);
//     res.status(500).json({ success: false, message: "Unable to load image." });
//   }
// });

// // Admin: upload an image to MongoDB.
// router.post("/admin/upload", adminOnly, (req, res, next) => {
//   upload.single("image")(req, res, (error) => {
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message || "Image upload failed.",
//       });
//     }
//     next();
//   });
// }, async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'Attach an image using the multipart field name "image".',
//       });
//     }

//     // Do not trust the browser's MIME type alone.
//     const signature = req.file.buffer.subarray(0, 12);
//     const isJpeg = signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff;
//     const isPng = signature.subarray(0, 8).equals(
//       Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
//     );
//     const isWebp =
//       signature.subarray(0, 4).toString() === "RIFF" &&
//       signature.subarray(8, 12).toString() === "WEBP";
//     const isGif = signature.subarray(0, 3).toString() === "GIF";

//     const signatureMatches =
//       (req.file.mimetype === "image/jpeg" && isJpeg) ||
//       (req.file.mimetype === "image/png" && isPng) ||
//       (req.file.mimetype === "image/webp" && isWebp) ||
//       (req.file.mimetype === "image/gif" && isGif);

//     if (!signatureMatches) {
//       return res.status(400).json({
//         success: false,
//         message: "The uploaded file does not match its image type.",
//       });
//     }

//     const media = await BlogMedia.create({
//       originalName: req.file.originalname.slice(0, 255),
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//       data: req.file.buffer,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Image uploaded successfully.",
//       data: {
//         imageMediaId: String(media._id),
//         image: await makeImageUrl(media._id),
//         originalName: media.originalName,
//         size: media.size,
//       },
//     });
//   } catch (error) {
//     console.error("Upload blog image failed:", error);
//     res.status(500).json({ success: false, message: "Unable to store image." });
//   }
// });

// // Admin: create a post. New posts are drafts unless status is PUBLISHED.
// router.post("/admin", adminOnly, async (req, res) => {
//   try {
//     const problem = validatePost(req.body);
//     if (problem) {
//       return res.status(400).json({ success: false, message: problem });
//     }

//     const slug = slugify(req.body.slug || req.body.title);
//     if (!slug) {
//       return res.status(400).json({ success: false, message: "A valid slug is required." });
//     }

//     if (await BlogPost.exists({ slug })) {
//       return res.status(409).json({
//         success: false,
//         message: "That slug is already in use. Choose a different slug.",
//       });
//     }

//     const imageMediaId = req.body.imageMediaId || null;
//     if (imageMediaId && !(await BlogMedia.exists({ _id: imageMediaId }))) {
//       return res.status(400).json({ success: false, message: "Uploaded image was not found." });
//     }

//     if (!imageMediaId && !req.body.image) {
//       return res.status(400).json({
//         success: false,
//         message: "Upload an image or provide an external image URL.",
//       });
//     }

//     const status = req.body.status || "DRAFT";
//     const post = await BlogPost.create({
//       title: req.body.title.trim(),
//       slug,
//       excerpt: req.body.excerpt.trim(),
//       content: req.body.content,
//       category: req.body.category,
//       imageMediaId,
//       externalImageUrl: imageMediaId ? null : req.body.image,
//       imageAlt: req.body.imageAlt.trim(),
//       readTime: estimateReadTime(req.body.content),
//       status,
//       publishedAt: status === "PUBLISHED" ? new Date() : null,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Blog post created.",
//       data: await serializePost(post.toObject()),
//     });
//   } catch (error) {
//     console.error("Create blog post failed:", error);
//     res.status(500).json({ success: false, message: "Unable to create blog post." });
//   }
// });

// // Admin: edit an existing post.
// router.patch("/admin/:id", adminOnly, async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).json({ success: false, message: "Invalid post ID." });
//     }

//     const problem = validatePost(req.body, true);
//     if (problem) {
//       return res.status(400).json({ success: false, message: problem });
//     }

//     const update: Record<string, any> = {};

//     for (const field of ["title", "excerpt", "content", "category", "imageAlt"] as const) {
//       if (req.body[field] !== undefined) {
//         update[field] = req.body[field].trim();
//       }
//     }

//     if (req.body.title !== undefined) {
//       update.slug = slugify(req.body.slug || req.body.title);
//     } else if (req.body.slug !== undefined) {
//       update.slug = slugify(req.body.slug);
//     }

//     if (update.slug === "") {
//       return res.status(400).json({ success: false, message: "A valid slug is required." });
//     }

//     if (update.content !== undefined) {
//       update.readTime = estimateReadTime(update.content);
//     }

//     if (req.body.imageMediaId !== undefined) {
//       if (
//         req.body.imageMediaId &&
//         !(await BlogMedia.exists({ _id: req.body.imageMediaId }))
//       ) {
//         return res.status(400).json({ success: false, message: "Uploaded image was not found." });
//       }
//       update.imageMediaId = req.body.imageMediaId || null;
//       update.externalImageUrl = null;
//     }

//     if (req.body.image !== undefined) {
//       if (req.body.image !== null && !isValidExternalImageUrl(req.body.image)) {
//         return res.status(400).json({ success: false, message: "Invalid external image URL." });
//       }
//       update.externalImageUrl = req.body.image || null;
//       update.imageMediaId = null;
//     }

//     if (req.body.status !== undefined) {
//       update.status = req.body.status;
//       if (req.body.status === "PUBLISHED") {
//         const current = await BlogPost.findById(req.params.id).select("publishedAt").lean();
//         update.publishedAt = current?.publishedAt || new Date();
//       } else {
//         update.publishedAt = null;
//       }
//     }

//     if (update.slug) {
//       const collision = await BlogPost.exists({
//         slug: update.slug,
//         _id: { $ne: req.params.id },
//       });
//       if (collision) {
//         return res.status(409).json({ success: false, message: "That slug is already in use." });
//       }
//     }

//     const post = await BlogPost.findByIdAndUpdate(
//       req.params.id,
//       { $set: update },
//       { new: true, runValidators: true }
//     ).lean();

//     if (!post) {
//       return res.status(404).json({ success: false, message: "Blog post not found." });
//     }

//     res.json({ success: true, message: "Blog post updated.", data: await serializePost(post) });
//   } catch (error) {
//     console.error("Update blog post failed:", error);
//     res.status(500).json({ success: false, message: "Unable to update blog post." });
//   }
// });

// // Admin: list drafts and published posts.
// router.get("/admin", adminOnly, async (req, res) => {
//   try {
//     const posts = await BlogPost.find()
//       .sort({ updatedAt: -1 })
//       .limit(200)
//       .lean();

//     res.json({
//       success: true,
//       data: await Promise.all(posts.map(serializePost)),
//     });
//   } catch (error) {
//     console.error("Admin list blog posts failed:", error);
//     res.status(500).json({ success: false, message: "Unable to load admin posts." });
//   }
// });

// // Admin: delete a post. Image is retained because it may be reused by another post.
// router.delete("/admin/:id", adminOnly, async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).json({ success: false, message: "Invalid post ID." });
//     }

//     const post = await BlogPost.findByIdAndDelete(req.params.id);
//     if (!post) {
//       return res.status(404).json({ success: false, message: "Blog post not found." });
//     }

//     res.json({ success: true, message: "Blog post deleted." });
//   } catch (error) {
//     console.error("Delete blog post failed:", error);
//     res.status(500).json({ success: false, message: "Unable to delete blog post." });
//   }
// });

// export default router;
