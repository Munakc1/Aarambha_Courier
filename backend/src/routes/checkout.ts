import express from "express";
import {
  buildForm, verifyResponse, paisaToRupees, generateTransactionUuid,
  ESEWA_TEST_SECRET, ESEWA_TEST_PRODUCT_CODE,
} from "@lacspace/esewa";
import { initiate, lookup } from "@lacspace/khalti";
import { Money, formatBasic } from "@lacspace/money";
import { v } from "@lacspace/validate";
import { asyncHandler, HttpError } from "../http.js";
import { env } from "../env.js";
import { Order } from "../models/order.js";

// how this works: create an order, then start a gateway payment. eSewa works in TEST
// mode with the package's baked-in sandbox keys (no credentials!). Khalti needs a real
// secret. After the customer returns, the frontend calls /verify — never trust the
// redirect alone, always confirm server-side.
const router = express.Router();
const web = () => env.CORS_ORIGIN.split(",")[0]!.trim();

const CreateInput = v.object({ label: v.string().min(1).max(120), amount: v.number().positive() });

// POST /checkout — create a pending order (amount in RUPEES from the UI → stored as paisa).
router.post("/", asyncHandler(async (req, res) => {
  const { label, amount } = CreateInput.parse(req.body);
  const amountPaisa = Money.of(amount, "NPR").toMinor();
  const order = await Order.create({ userId: req.user!.sub, label, amountPaisa });
  res.status(201).json({ id: String(order._id), label, amountPaisa, display: formatBasic(Money.fromMinor(amountPaisa, "NPR")) });
}));

// POST /checkout/:id/esewa — build the signed eSewa form to auto-POST from the browser.
router.post("/:id/esewa", asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user!.sub });
  if (!order) throw new HttpError(404, "Order not found");
  const secret = process.env.ESEWA_SECRET ?? ESEWA_TEST_SECRET;
  const productCode = process.env.ESEWA_MERCHANT_CODE ?? ESEWA_TEST_PRODUCT_CODE;
  const esewaEnv: "test" | "prod" = process.env.ESEWA_SECRET ? "prod" : "test";
  const uuid = generateTransactionUuid();
  order.ref = uuid;
  order.gateway = "esewa";
  await order.save();
  const form = await buildForm(
    {
      amount: paisaToRupees(order.amountPaisa),
      transactionUuid: uuid,
      productCode,
      successUrl: web() + "/checkout/success?orderId=" + String(order._id),
      failureUrl: web() + "/checkout/failed?orderId=" + String(order._id),
    },
    { secret, env: esewaEnv },
  );
  res.json(form);
}));

// POST /checkout/:id/esewa/verify — verify the base64 `data` eSewa returned; mark paid.
router.post("/:id/esewa/verify", asyncHandler(async (req, res) => {
  const { data } = v.object({ data: v.string().min(1) }).parse(req.body);
  const order = await Order.findOne({ _id: req.params.id, userId: req.user!.sub });
  if (!order) throw new HttpError(404, "Order not found");
  const secret = process.env.ESEWA_SECRET ?? ESEWA_TEST_SECRET;
  const result = await verifyResponse(data, secret);
  const status = String((result.data as { status?: string }).status ?? "");
  if (!result.valid || status !== "COMPLETE") throw new HttpError(400, "Payment could not be verified");
  order.status = "paid";
  await order.save();
  res.json({ id: String(order._id), status: "paid" });
}));

// POST /checkout/:id/khalti — start a Khalti payment (needs KHALTI_SECRET, else 501).
router.post("/:id/khalti", asyncHandler(async (req, res) => {
  const secretKey = process.env.KHALTI_SECRET;
  if (!secretKey) throw new HttpError(501, "Set KHALTI_SECRET in .env to enable Khalti (see .env.example).");
  const order = await Order.findOne({ _id: req.params.id, userId: req.user!.sub });
  if (!order) throw new HttpError(404, "Order not found");
  order.gateway = "khalti";
  await order.save();
  const r = await initiate(
    {
      return_url: web() + "/checkout/success?orderId=" + String(order._id),
      website_url: web(),
      amount: order.amountPaisa,
      purchase_order_id: String(order._id),
      purchase_order_name: order.label,
    },
    { secretKey, env: "test" },
  );
  order.ref = r.pidx;
  await order.save();
  res.json({ paymentUrl: r.payment_url, pidx: r.pidx });
}));

// POST /checkout/:id/khalti/verify — authoritative lookup by pidx; mark paid.
router.post("/:id/khalti/verify", asyncHandler(async (req, res) => {
  const secretKey = process.env.KHALTI_SECRET;
  if (!secretKey) throw new HttpError(501, "Khalti is not configured");
  const { pidx } = v.object({ pidx: v.string().min(1) }).parse(req.body);
  const order = await Order.findOne({ _id: req.params.id, userId: req.user!.sub });
  if (!order) throw new HttpError(404, "Order not found");
  const r = await lookup(pidx, { secretKey, env: "test" });
  if (r.status !== "Completed") throw new HttpError(400, "Payment status: " + String(r.status));
  order.status = "paid";
  await order.save();
  res.json({ id: String(order._id), status: "paid" });
}));

export default router;
