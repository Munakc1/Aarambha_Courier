
"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  UserRound,
  MapPin,
  Wallet,
  CheckCircle2,
  RotateCcw,
  LoaderCircle,
  CreditCard,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

type PaymentMethod = "COD" | "ESEWA";

type ShipmentForm = {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  description: string;
  weight: string;
  parcelValue: string;
  shippingFee: string;
  paymentMethod: PaymentMethod;
  notes: string;
};

type FieldName = keyof ShipmentForm;

type CreatedShipment = {
  id?: string;
  _id?: string;
  trackingNumber: string;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus?: string;
  shippingFee: number;
  codAmount?: number;
  codStatus?: string;
};

type ApiResult = {
  success?: boolean;
  message?: string;
  shipment?: CreatedShipment;
  payment?: {
    action?: string;
    fields?: Record<string, string | number>;
  };
  data?: {
    action?: string;
    paymentUrl?: string;
    fields?: Record<string, string | number>;
  };
  action?: string;
  paymentUrl?: string;
  fields?: Record<string, string | number>;
};

const initialForm: ShipmentForm = {
  senderName: "",
  senderPhone: "",
  senderAddress: "",
  senderCity: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverCity: "",
  description: "",
  weight: "",
  parcelValue: "",
  shippingFee: "",
  paymentMethod: "COD",
  notes: "",
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const NEPALI_PHONE_PATTERN = /^9[678]\d{8}$/;

function formatMoney(amount: number | undefined) {
  return `Rs. ${(Number(amount) || 0).toLocaleString("en-NP")}`;
}

export default function CreateShipmentPage() {
  const [form, setForm] = useState<ShipmentForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [createdShipment, setCreatedShipment] =
    useState<CreatedShipment | null>(null);
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    const field = name as FieldName;

    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setApiError("");
    setNotice("");
  }

  function validate() {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    const requiredFields: FieldName[] = [
      "senderName",
      "senderPhone",
      "senderAddress",
      "senderCity",
      "receiverName",
      "receiverPhone",
      "receiverAddress",
      "receiverCity",
      "description",
      "weight",
      "parcelValue",
      "shippingFee",
    ];

    for (const field of requiredFields) {
      if (!String(form[field]).trim()) {
        nextErrors[field] = "This field is required.";
      }
    }

    if (
      form.senderPhone.trim() &&
      !NEPALI_PHONE_PATTERN.test(form.senderPhone.trim())
    ) {
      nextErrors.senderPhone =
        "Enter a valid 10-digit Nepali mobile number.";
    }

    if (
      form.receiverPhone.trim() &&
      !NEPALI_PHONE_PATTERN.test(form.receiverPhone.trim())
    ) {
      nextErrors.receiverPhone =
        "Enter a valid 10-digit Nepali mobile number.";
    }

    const weight = Number(form.weight);
    const parcelValue = Number(form.parcelValue);
    const shippingFee = Number(form.shippingFee);

    if (
      form.weight.trim() &&
      (!Number.isFinite(weight) || weight <= 0)
    ) {
      nextErrors.weight = "Weight must be greater than zero.";
    }

    if (
      form.parcelValue.trim() &&
      (!Number.isFinite(parcelValue) || parcelValue < 0)
    ) {
      nextErrors.parcelValue = "Parcel value cannot be negative.";
    }

    if (
      form.shippingFee.trim() &&
      (!Number.isFinite(shippingFee) || shippingFee <= 0)
    ) {
      nextErrors.shippingFee =
        "Shipping fee must be greater than zero.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function readJson(response: Response): Promise<ApiResult> {
    return (await response.json().catch(() => ({}))) as ApiResult;
  }

  async function startEsewaPayment(shipment: CreatedShipment) {
    const shipmentId = shipment.id || shipment._id;

    if (!shipmentId) {
      setApiError(
        "The shipment was saved, but the backend did not return its ID. Please check the shipment API response."
      );
      return;
    }

    setSubmitting(true);
    setApiError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/api/payments/esewa/initiate`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ shipmentId }),
        }
      );

      const result = await readJson(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            `Could not start eSewa payment (HTTP ${response.status}).`
        );
      }

      const paymentData = result.payment ?? result.data ?? result;

      const action =
        paymentData.action ||
        ("paymentUrl" in paymentData ? paymentData.paymentUrl : undefined);

      const fields = paymentData.fields;

      if (
        typeof action !== "string" ||
        !fields ||
        typeof fields !== "object" ||
        Array.isArray(fields)
      ) {
        throw new Error(
          "The backend did not return the eSewa payment URL and signed fields."
        );
      }

      const paymentUrl = new URL(action);

      const allowedHosts = [
        "rc-epay.esewa.com.np",
        "epay.esewa.com.np",
      ];

      if (
        paymentUrl.protocol !== "https:" ||
        !allowedHosts.includes(paymentUrl.hostname)
      ) {
        throw new Error(
          "The payment URL is not a recognized official eSewa gateway. Check your backend configuration."
        );
      }

      const paymentForm = document.createElement("form");
      paymentForm.method = "POST";
      paymentForm.action = paymentUrl.toString();
      paymentForm.style.display = "none";

      for (const [name, value] of Object.entries(fields)) {
        if (
          typeof value !== "string" &&
          typeof value !== "number"
        ) {
          throw new Error(`Invalid payment field: ${name}`);
        }

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = String(value);
        paymentForm.appendChild(input);
      }

      document.body.appendChild(paymentForm);

      // Browser redirects to eSewa using the backend-generated form.
      paymentForm.submit();
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to redirect to eSewa."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || !validate()) return;

    setSubmitting(true);
    setApiError("");
    setNotice("");
    setCreatedShipment(null);

    try {
      const payload = {
        senderName: form.senderName.trim(),
        senderPhone: form.senderPhone.trim(),
        senderAddress: form.senderAddress.trim(),
        senderCity: form.senderCity.trim(),
        receiverName: form.receiverName.trim(),
        receiverPhone: form.receiverPhone.trim(),
        receiverAddress: form.receiverAddress.trim(),
        receiverCity: form.receiverCity.trim(),
        description: form.description.trim(),
        weight: Number(form.weight),
        parcelValue: Number(form.parcelValue),
        shippingFee: Number(form.shippingFee),
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim(),
      };

      const response = await fetch(`${API_URL}/api/shipments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await readJson(response);

      if (
        !response.ok ||
        result.success !== true ||
        !result.shipment
      ) {
        throw new Error(
          result.message ||
            `Could not create shipment (HTTP ${response.status}).`
        );
      }

      const shipment = result.shipment;

      // Display the saved shipment before attempting payment.
      setCreatedShipment(shipment);

      if (form.paymentMethod === "COD") {
        setNotice("Your COD shipment has been saved.");
        setForm(initialForm);
        return;
      }

      // Start eSewa for this saved shipment, without creating a second one.
      await startEsewaPayment(shipment);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    if (submitting) return;

    setForm(initialForm);
    setErrors({});
    setApiError("");
    setNotice("");
    setCreatedShipment(null);
  }

  const isEsewa = form.paymentMethod === "ESEWA";

  return (
    <main className="min-h-screen bg-app p-4 text-fg sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/vendor/shipments"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to Shipments
        </Link>

        <header>
          <p className="text-sm text-muted">Vendor / Shipments / New</p>
          <h1 className="mt-2 text-3xl font-bold">Create Shipment</h1>
          <p className="mt-2 text-sm text-muted">
            Add the sender, receiver, parcel and payment details.
          </p>
        </header>

        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p>{apiError}</p>
              {createdShipment?.paymentMethod === "ESEWA" && (
                <p className="mt-2">
                  Your shipment may already be saved. Use the retry button
                  below rather than creating the same shipment again.
                </p>
              )}
            </div>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <p>{notice}</p>
          </div>
        )}

        {createdShipment && (
          <section
            aria-live="polite"
            className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={23} />
              <h2 className="font-semibold text-emerald-700">
                Shipment saved
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted">Tracking number</p>
                <p className="mt-1 font-bold">
                  {createdShipment.trackingNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Shipment status</p>
                <p className="mt-1 font-semibold">
                  {createdShipment.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Payment method</p>
                <p className="mt-1 font-semibold">
                  {createdShipment.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Shipping fee</p>
                <p className="mt-1 font-semibold">
                  {formatMoney(createdShipment.shippingFee)}
                </p>
              </div>
            </div>

            {createdShipment.paymentMethod === "COD" && (
              <p className="text-sm">
                COD amount:{" "}
                <strong>
                  {formatMoney(createdShipment.codAmount)}
                </strong>
                {createdShipment.codStatus
                  ? ` · ${createdShipment.codStatus}`
                  : ""}
              </p>
            )}

            {createdShipment.paymentMethod === "ESEWA" && (
              <div className="space-y-2 border-t border-emerald-500/20 pt-4">
                <p className="text-sm">
                  Payment status:{" "}
                  <strong>
                    {createdShipment.paymentStatus || "Pending"}
                  </strong>
                </p>
                <p className="text-sm text-muted">
                  If you have not reached eSewa yet, retry the payment below.
                  The shipment will not be recreated.
                </p>
                <button
                  type="button"
                  onClick={() => void startEsewaPayment(createdShipment)}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <CreditCard size={17} />
                  )}
                  {submitting ? "Connecting to eSewa..." : "Retry eSewa Payment"}
                  {!submitting && <ExternalLink size={15} />}
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-1">
              <Link
                href={`/track?number=${encodeURIComponent(
                  createdShipment.trackingNumber
                )}`}
                className="text-sm font-semibold underline"
              >
                Track shipment
              </Link>
              <Link
                href="/vendor/shipments"
                className="text-sm font-semibold underline"
              >
                View all shipments
              </Link>
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="text-sm font-semibold underline disabled:opacity-50"
              >
                Create another
              </button>
            </div>
          </section>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <FormSection
            title="Sender Information"
            description="Details of the person sending the parcel."
            icon={<UserRound size={21} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Sender Name" name="senderName" value={form.senderName} onChange={updateField} error={errors.senderName} required />
              <Field label="Sender Phone" name="senderPhone" value={form.senderPhone} onChange={updateField} error={errors.senderPhone} placeholder="98XXXXXXXX" required />
              <Field label="Pickup Address" name="senderAddress" value={form.senderAddress} onChange={updateField} error={errors.senderAddress} required />
              <Field label="Pickup City" name="senderCity" value={form.senderCity} onChange={updateField} error={errors.senderCity} required />
            </div>
          </FormSection>

          <FormSection
            title="Receiver Information"
            description="Where the parcel needs to be delivered."
            icon={<MapPin size={21} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Receiver Name" name="receiverName" value={form.receiverName} onChange={updateField} error={errors.receiverName} required />
              <Field label="Receiver Phone" name="receiverPhone" value={form.receiverPhone} onChange={updateField} error={errors.receiverPhone} placeholder="98XXXXXXXX" required />
              <Field label="Delivery Address" name="receiverAddress" value={form.receiverAddress} onChange={updateField} error={errors.receiverAddress} required />
              <Field label="Delivery City" name="receiverCity" value={form.receiverCity} onChange={updateField} error={errors.receiverCity} required />
            </div>
          </FormSection>

          <FormSection
            title="Parcel Information"
            description="Provide the package details and applicable charges."
            icon={<Package size={21} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Parcel Description" name="description" value={form.description} onChange={updateField} error={errors.description} placeholder="Clothes, electronics, documents..." required />
              <Field label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={updateField} error={errors.weight} required />
              <Field label="Parcel Value (Rs.)" name="parcelValue" type="number" value={form.parcelValue} onChange={updateField} error={errors.parcelValue} required />
              <Field label="Shipping Fee (Rs.)" name="shippingFee" type="number" value={form.shippingFee} onChange={updateField} error={errors.shippingFee} required />

              <label className="block space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Payment Method</span>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={updateField}
                  className="w-full rounded-xl border border-hairline bg-app px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="ESEWA">Pay shipping fee with eSewa</option>
                </select>
                <span className="block text-xs text-muted">
                  COD collects the parcel value from the recipient. eSewa
                  redirects you to the payment gateway to pay the shipping fee.
                </span>
              </label>

              <label className="block space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Additional Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  rows={3}
                  placeholder="Optional delivery instructions..."
                  className="w-full resize-y rounded-xl border border-hairline bg-app px-4 py-3 outline-none focus:border-primary"
                />
              </label>
            </div>
          </FormSection>

          <div className="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-sm text-muted">
              {isEsewa ? (
                <CreditCard size={20} className="text-primary" />
              ) : (
                <Wallet size={20} className="text-primary" />
              )}
              <div>
                <p>
                  Method:{" "}
                  <strong className="text-fg">
                    {isEsewa ? "eSewa Online Payment" : "Cash on Delivery"}
                  </strong>
                </p>
                <p className="mt-1">
                  Shipping fee: {formatMoney(Number(form.shippingFee) || 0)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-semibold hover:bg-panel disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                type="submit"
                disabled={submitting || Boolean(createdShipment)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : isEsewa ? (
                  <CreditCard size={17} />
                ) : (
                  <Package size={17} />
                )}
                {submitting
                  ? "Processing..."
                  : isEsewa
                    ? "Create & Pay with eSewa"
                    : "Create COD Shipment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-3 border-b border-hairline pb-5">
        <div className="rounded-xl bg-primary/15 p-3 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: FieldName;
  value: string;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "any" : undefined}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-app px-4 py-3 outline-none transition focus:border-primary ${
          error ? "border-red-500" : "border-hairline"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
