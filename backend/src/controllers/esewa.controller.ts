
import type { Request, Response, NextFunction } from "express";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import Shipment from "../models/Shipment.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const SECRET_KEY = process.env.ESEWA_SECRET_KEY;

const FORM_URL =
  process.env.ESEWA_FORM_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const STATUS_URL =
  process.env.ESEWA_STATUS_URL ||
  "https://rc.esewa.com.np/api/epay/transaction/status/";

function sign(message: string): string {
  if (!SECRET_KEY) {
    throw new Error("ESEWA_SECRET_KEY is missing from backend/.env");
  }

  return createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("base64");
}

function safeCompare(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return (
    first.length === second.length &&
    timingSafeEqual(first, second)
  );
}

function redirectFailed(res: Response, reason: string): void {
  res.redirect(
    `${FRONTEND_URL}/payment/failed?reason=${encodeURIComponent(reason)}`
  );
}

export async function initiateEsewaPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!SECRET_KEY) {
      res.status(500).json({
        success: false,
        message: "eSewa server configuration is missing.",
      });
      return;
    }

    const { shipmentId } = req.body as {
      shipmentId?: string;
    };

    if (!shipmentId) {
      res.status(400).json({
        success: false,
        message: "shipmentId is required.",
      });
      return;
    }

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found.",
      });
      return;
    }

    // Add your project's vendor ownership check here before production.
    // For example, compare the shipment's vendor field to req.vendorId.

    if (shipment.paymentMethod !== "ESEWA") {
      res.status(400).json({
        success: false,
        message: "This shipment does not use eSewa.",
      });
      return;
    }

    if (shipment.paymentStatus === "PAID") {
      res.status(409).json({
        success: false,
        message: "This shipment is already paid.",
      });
      return;
    }

    const amount = Number(shipment.shippingFee);

    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid shipment shipping fee.",
      });
      return;
    }

    const amountString = amount.toFixed(2);
    const transactionUuid = randomUUID();

    const fields: Record<string, string> = {
      amount: amountString,
      tax_amount: "0",
      total_amount: amountString,
      transaction_uuid: transactionUuid,
      product_code: PRODUCT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${BACKEND_URL}/api/payments/esewa/verify`,
      failure_url: `${FRONTEND_URL}/payment/failed?trackingNumber=${encodeURIComponent(
        shipment.trackingNumber
      )}`,
      signed_field_names:
        "total_amount,transaction_uuid,product_code",
    };

    fields.signature = sign(
      `total_amount=${fields.total_amount},transaction_uuid=${fields.transaction_uuid},product_code=${fields.product_code}`
    );

    shipment.esewaTransactionUuid = transactionUuid;
    shipment.paymentStatus = "PENDING";
    await shipment.save();

    res.status(200).json({
      success: true,
      payment: {
        paymentUrl: FORM_URL,
        fields,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEsewaPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!SECRET_KEY) {
      redirectFailed(res, "server_configuration");
      return;
    }

    const encodedData =
      typeof req.query.data === "string" ? req.query.data : "";

    if (!encodedData) {
      redirectFailed(res, "missing_payment_data");
      return;
    }

    let data: Record<string, unknown>;

    try {
      data = JSON.parse(
        Buffer.from(encodedData, "base64").toString("utf8")
      ) as Record<string, unknown>;
    } catch {
      redirectFailed(res, "invalid_payment_data");
      return;
    }

    const transactionUuid = data.transaction_uuid;
    const productCode = data.product_code;
    const totalAmount = data.total_amount;
    const status = data.status;
    const signedNames = data.signed_field_names;
    const signature = data.signature;

    if (
      typeof transactionUuid !== "string" ||
      typeof productCode !== "string" ||
      typeof totalAmount !== "string" &&
        typeof totalAmount !== "number" ||
      typeof status !== "string" ||
      typeof signedNames !== "string" ||
      typeof signature !== "string" ||
      productCode !== PRODUCT_CODE
    ) {
      redirectFailed(res, "invalid_payment_response");
      return;
    }

    const signedFields = signedNames.split(",");

    if (
      !signedFields.includes("transaction_uuid") ||
      !signedFields.includes("total_amount") ||
      !signedFields.includes("product_code") ||
      signedFields.some(
        (field) =>
          !/^[a-z_]+$/.test(field) ||
          data[field] === undefined ||
          data[field] === null
      )
    ) {
      redirectFailed(res, "invalid_signature_fields");
      return;
    }

    const signedMessage = signedFields
      .map((field) => `${field}=${String(data[field])}`)
      .join(",");

    if (!safeCompare(signature, sign(signedMessage))) {
      redirectFailed(res, "signature_mismatch");
      return;
    }

    const shipment = await Shipment.findOne({
      esewaTransactionUuid: transactionUuid,
      paymentMethod: "ESEWA",
    });

    if (!shipment) {
      redirectFailed(res, "shipment_not_found");
      return;
    }

    const expectedAmount = Number(shipment.shippingFee);
    const returnedAmount = Number(totalAmount);

    if (
      !Number.isFinite(returnedAmount) ||
      Math.abs(returnedAmount - expectedAmount) > 0.001
    ) {
      redirectFailed(res, "amount_mismatch");
      return;
    }

    // Independently confirm the transaction with eSewa.
    const query = new URLSearchParams({
      product_code: PRODUCT_CODE,
      total_amount: String(totalAmount),
      transaction_uuid: transactionUuid,
    });

    const verificationResponse = await fetch(
      `${STATUS_URL}?${query.toString()}`,
      { method: "GET" }
    );

    if (!verificationResponse.ok) {
      redirectFailed(res, "verification_unavailable");
      return;
    }

    const verified = (await verificationResponse.json()) as {
      status?: string;
      total_amount?: string | number;
      transaction_uuid?: string;
      product_code?: string;
    };

    if (
      verified.status !== "COMPLETE" ||
      verified.transaction_uuid !== transactionUuid ||
      verified.product_code !== PRODUCT_CODE ||
      !Number.isFinite(Number(verified.total_amount)) ||
      Math.abs(Number(verified.total_amount) - expectedAmount) > 0.001
    ) {
      redirectFailed(res, "payment_not_confirmed");
      return;
    }

    // Update only after eSewa confirms the payment.
    if (shipment.paymentStatus !== "PAID") {
      shipment.paymentStatus = "PAID";
      await shipment.save();
    }

    res.redirect(
      `${FRONTEND_URL}/payment/success?trackingNumber=${encodeURIComponent(
        shipment.trackingNumber
      )}`
    );
  } catch (error) {
    next(error);
  }
}
