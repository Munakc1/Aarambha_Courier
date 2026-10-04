import express from "express";
import { asyncHandler, HttpError } from "../http.js";
import { requireAuth } from "../middleware/auth.js";
import { Note, type NoteDoc } from "../models/note.js";
import { cache } from "../cache.js";
import { NoteInput } from "../validation.js";
import type { Note as NoteDTO } from "@ammrambha_courier/types";

const router = express.Router();
router.use(requireAuth); // every /notes route requires a valid token

function toDTO(n: NoteDoc): NoteDTO {
  return {
    id: String(n._id),
    title: n.title,
    body: n.body,
    userId: String(n.userId),
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  };
}
const listKey = (userId: string): string => `notes:${userId}`;

// GET /notes — this user's notes. Cached for 30s (Redis or in-memory); every write
// below busts the cache, so reads are fast but never stale after a change.
router.get("/", asyncHandler(async (req, res) => {
  const userId = req.user!.sub;
  const cached = await cache.get(listKey(userId));
  if (cached) { res.json(JSON.parse(cached) as NoteDTO[]); return; }
  const notes = await Note.find({ userId }).sort({ createdAt: -1 });
  const dto = notes.map(toDTO);
  await cache.set(listKey(userId), JSON.stringify(dto), 30);
  res.json(dto);
}));

// POST /notes — create a note.
router.post("/", asyncHandler(async (req, res) => {
  const userId = req.user!.sub;
  const { title, body } = NoteInput.parse(req.body);
  const note = await Note.create({ title, body, userId });
  await cache.del(listKey(userId));
  res.status(201).json(toDTO(note));
}));

// GET /notes/:id — one note (only if it's yours).
router.get("/:id", asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user!.sub });
  if (!note) throw new HttpError(404, "Note not found");
  res.json(toDTO(note));
}));

// PATCH /notes/:id — update a note.
router.patch("/:id", asyncHandler(async (req, res) => {
  const patch = NoteInput.partial().parse(req.body);
  const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user!.sub }, { $set: patch }, { new: true });
  if (!note) throw new HttpError(404, "Note not found");
  await cache.del(listKey(req.user!.sub));
  res.json(toDTO(note));
}));

// DELETE /notes/:id — delete a note.
router.delete("/:id", asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user!.sub });
  if (!note) throw new HttpError(404, "Note not found");
  await cache.del(listKey(req.user!.sub));
  res.status(204).end();
}));

export default router;
