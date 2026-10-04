import express from "express";
import { SSEHub, sseHandler } from "@lacspace/sse";
import { asyncHandler } from "../http.js";

// how this works: one shared hub holds every open SSE connection. GET /live opens
// a stream; POST /live/broadcast pushes a "message" event to everyone connected.
// Push from anywhere in your app by importing this hub and calling hub.broadcast().
const router = express.Router();
const hub = new SSEHub();
hub.startHeartbeat();

router.get("/", (_req, res) => {
  const client = sseHandler(res, { onClose: () => hub.remove(client) });
  hub.add(client);
  client.send({ event: "message", data: { text: "Connected to the live feed." } });
});

router.post("/broadcast", asyncHandler(async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text : "ping";
  const sent = hub.broadcast({ event: "message", data: { text } });
  res.json({ sent });
}));

export default router;
