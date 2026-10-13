
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  Store,
  UserRound,
} from "lucide-react";

type VendorProfile = {
  contactName: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  registrationNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  description: string;
};

const initialProfile: VendorProfile = {
  contactName: "Muna K.C.",
  businessName: "Aarambha Store",
  email: "vendor@example.com",
  phone: "9800000000",
  businessType: "Retail",
  registrationNumber: "",
  address: "Sorhakhutte",
  city: "Kathmandu",
  province: "Bagmati Province",
  postalCode: "44600",
  description:
    "Vendor profile for managing shipments, customer orders, and business operations.",
};

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile>(initialProfile);
  const [notice, setNotice] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  function updateField<K extends keyof VendorProfile>(
    key: K,
    value: VendorProfile[K],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsEditing(false);
    setNotice(
      "Profile updated in this session. Connect your backend to save changes permanently.",
    );
  }

  function handleCancel() {
    setProfile(initialProfile);
    setIsEditing(false);
    setNotice("");
  }

  return (
    <main className="min-h-screen bg-app px-4 py-6 text-fg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/vendor/shipments"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Shipments
            </Link>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Vendor Profile
            </h1>
            <p className="mt-2 text-sm text-muted">
              Manage your business details and contact information.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setNotice("");
                setIsEditing(true);
              }}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
            >
              Edit Profile
            </button>
          )}
        </header>

        {notice && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="card overflow-hidden rounded-2xl">
          <div className="border-b border-hairline bg-panel/60 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-app text-primary">
                <Store size={30} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold">{profile.businessName}</h2>
                <p className="mt-1 text-sm text-muted">
                  {profile.businessType} vendor
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <CheckCircle2 size={14} />
                  Vendor account
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="space-y-8 p-5 sm:p-6">
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl border border-hairline bg-panel p-2.5 text-primary">
                    <UserRound size={19} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact Information</h3>
                    <p className="mt-1 text-sm text-muted">
                      Details for contacting your business.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field
                    label="Contact Person"
                    value={profile.contactName}
                    disabled={!isEditing}
                    required
                    onChange={(value) => updateField("contactName", value)}
                  />
                  <Field
                    label="Business Name"
                    value={profile.businessName}
                    disabled={!isEditing}
                    required
                    onChange={(value) => updateField("businessName", value)}
                  />
                  <Field
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    required
                    onChange={(value) => updateField("email", value)}
                    icon={<Mail size={16} />}
                  />
                  <Field
                    label="Phone Number"
                    type="tel"
                    value={profile.phone}
                    disabled={!isEditing}
                    required
                    onChange={(value) => updateField("phone", value)}
                    icon={<Phone size={16} />}
                  />
                </div>
              </section>

              <section className="border-t border-hairline pt-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl border border-hairline bg-panel p-2.5 text-primary">
                    <Building2 size={19} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Information</h3>
                    <p className="mt-1 text-sm text-muted">
                      Basic information about your business.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Business Type
                    </label>
                    <select
                      disabled={!isEditing}
                      value={profile.businessType}
                      onChange={(event) =>
                        updateField("businessType", event.target.value)
                      }
                      className="w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <Field
                    label="Registration Number"
                    value={profile.registrationNumber}
                    disabled={!isEditing}
                    onChange={(value) =>
                      updateField("registrationNumber", value)
                    }
                    placeholder="Enter registration number"
                  />

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Business Description
                    </label>
                    <textarea
                      rows={4}
                      disabled={!isEditing}
                      value={profile.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Describe your business..."
                      className="w-full resize-y rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none transition placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  </div>
                </div>
              </section>

              <section className="border-t border-hairline pt-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl border border-hairline bg-panel p-2.5 text-primary">
                    <MapPin size={19} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Address</h3>
                    <p className="mt-1 text-sm text-muted">
                      Your registered or primary business location.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field
                      label="Street / Area"
                      value={profile.address}
                      disabled={!isEditing}
                      required
                      onChange={(value) => updateField("address", value)}
                    />
                  </div>
                  <Field
                    label="City"
                    value={profile.city}
                    disabled={!isEditing}
                    required
                    onChange={(value) => updateField("city", value)}
                  />
                  <Field
                    label="Province"
                    value={profile.province}
                    disabled={!isEditing}
                    required
                    onChange={(value) => updateField("province", value)}
                  />
                  <Field
                    label="Postal Code"
                    value={profile.postalCode}
                    disabled={!isEditing}
                    onChange={(value) => updateField("postalCode", value)}
                  />
                </div>
              </section>
            </div>

            {isEditing && (
              <div className="flex flex-col-reverse gap-3 border-t border-hairline bg-panel/40 p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-hairline px-5 py-3 text-sm font-medium transition hover:bg-panel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-dark-1 transition hover:opacity-90"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="rounded-2xl border border-hairline bg-panel/50 p-5">
          <h3 className="font-semibold">Profile information</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Keep your business contact details up to date so customers and
            delivery partners can reach you. This demo stores changes in the
            current page state only. Connect a protected profile API to persist
            changes and load the authenticated vendor&apos;s actual information.
          </p>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  required = false,
  type = "text",
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-hairline bg-panel px-3 py-3 text-sm outline-none transition placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-70 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}
