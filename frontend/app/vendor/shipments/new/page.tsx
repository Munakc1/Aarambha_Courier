
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  UserRound,
  MapPin,
  Wallet,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

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
  paymentMethod: "COD" | "Prepaid";
  notes: string;
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
  paymentMethod: "COD",
  notes: "",
};

export default function CreateShipmentPage() {
  const [form, setForm] = useState<ShipmentForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdId, setCreatedId] = useState("");

  function updateField(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setCreatedId("");
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    const requiredFields: (keyof ShipmentForm)[] = [
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
    ];

    requiredFields.forEach((field) => {
      if (!String(form[field]).trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    const phonePattern = /^\+?[0-9\s-]{7,15}$/;

    if (
      form.senderPhone &&
      !phonePattern.test(form.senderPhone.trim())
    ) {
      nextErrors.senderPhone = "Enter a valid phone number.";
    }

    if (
      form.receiverPhone &&
      !phonePattern.test(form.receiverPhone.trim())
    ) {
      nextErrors.receiverPhone = "Enter a valid phone number.";
    }

    if (form.weight && Number(form.weight) <= 0) {
      nextErrors.weight = "Weight must be greater than zero.";
    }

    if (form.parcelValue && Number(form.parcelValue) < 0) {
      nextErrors.parcelValue = "Value cannot be negative.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    const id = `SHP-${Date.now().toString().slice(-8)}`;

    // Demo only: connect your backend API here to persist the shipment.
    setCreatedId(id);
  }

  function resetForm() {
    setForm(initialForm);
    setErrors({});
    setCreatedId("");
  }

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
            Enter the sender, recipient, and parcel information below.
          </p>
        </header>

        {createdId && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <CheckCircle2 className="mt-0.5 text-emerald-600" size={22} />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                Shipment details validated successfully.
              </p>
              <p className="mt-1 text-sm">
                Demo reference: <strong>{createdId}</strong>
              </p>
              <p className="mt-1 text-xs text-muted">
                This reference is not saved to a database. Connect your API to
                create a persistent shipment.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <FormSection
            title="Sender Information"
            description="Details of the person sending the parcel."
            icon={<UserRound size={21} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Sender Name"
                name="senderName"
                value={form.senderName}
                onChange={updateField}
                error={errors.senderName}
                required
              />
              <Field
                label="Sender Phone"
                name="senderPhone"
                value={form.senderPhone}
                onChange={updateField}
                error={errors.senderPhone}
                placeholder="98XXXXXXXX"
                required
              />
              <Field
                label="Pickup Address"
                name="senderAddress"
                value={form.senderAddress}
                onChange={updateField}
                error={errors.senderAddress}
                required
              />
              <Field
                label="Pickup City"
                name="senderCity"
                value={form.senderCity}
                onChange={updateField}
                error={errors.senderCity}
                required
              />
            </div>
          </FormSection>

          <FormSection
            title="Receiver Information"
            description="Where the parcel needs to be delivered."
            icon={<MapPin size={21} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Receiver Name"
                name="receiverName"
                value={form.receiverName}
                onChange={updateField}
                error={errors.receiverName}
                required
              />
              <Field
                label="Receiver Phone"
                name="receiverPhone"
                value={form.receiverPhone}
                onChange={updateField}
                error={errors.receiverPhone}
                placeholder="98XXXXXXXX"
                required
              />
              <Field
                label="Delivery Address"
                name="receiverAddress"
                value={form.receiverAddress}
                onChange={updateField}
                error={errors.receiverAddress}
                required
              />
              <Field
                label="Delivery City"
                name="receiverCity"
                value={form.receiverCity}
                onChange={updateField}
                error={errors.receiverCity}
                required
              />
            </div>
          </FormSection>

          <FormSection
            title="Parcel Information"
            description="Provide the package description, weight, and value."
            icon={<Package size={21} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Parcel Description"
                name="description"
                value={form.description}
                onChange={updateField}
                error={errors.description}
                placeholder="Clothes, electronics, documents..."
                required
              />
              <Field
                label="Weight (kg)"
                name="weight"
                type="number"
                value={form.weight}
                onChange={updateField}
                error={errors.weight}
                required
              />
              <Field
                label="Parcel Value (Rs.)"
                name="parcelValue"
                type="number"
                value={form.parcelValue}
                onChange={updateField}
                error={errors.parcelValue}
                required
              />

              <label className="block space-y-2 text-sm">
                <span className="font-medium">Payment Method</span>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={updateField}
                  className="w-full rounded-xl border border-hairline bg-app px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Prepaid">Prepaid</option>
                </select>
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
              <Wallet size={20} className="text-primary" />
              <span>
                Payment: <strong className="text-fg">{form.paymentMethod}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-semibold hover:bg-panel"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 hover:brightness-95"
              >
                <Package size={17} />
                Validate Shipment
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
  icon: React.ReactNode;
  children: React.ReactNode;
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
  name: keyof ShipmentForm;
  value: string;
  onChange: (
    event: React.ChangeEvent<
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
