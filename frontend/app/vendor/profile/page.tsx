"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

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

type FieldErrors = Partial<Record<keyof VendorProfile, string>>;

type ApiProfile = Partial<VendorProfile> & {
  fullName?: string;
  contactPerson?: string;
  business_name?: string;
  contact_name?: string;
};

type ApiResult = {
  message?: string;
  profile?: ApiProfile;
  vendor?: ApiProfile;
  data?: ApiProfile;
};

const emptyProfile: VendorProfile = {
  contactName: "",
  businessName: "",
  email: "",
  phone: "",
  businessType: "Other",
  registrationNumber: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  description: "",
};

const provinces = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

const businessTypes = [
  "Retail",
  "Wholesale",
  "Manufacturer",
  "Distributor",
  "E-commerce",
  "Other",
];

const inputClass =
  "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[#24221D] outline-none transition placeholder:text-[#A39B8D] focus:border-[#D69B00] focus:ring-4 focus:ring-[#FBB501]/15 disabled:cursor-not-allowed disabled:bg-[#F7F4EC] disabled:text-[#5B564C]";

const labelClass = "mb-2 block text-sm font-semibold text-[#24221D]";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot connect to the backend at ${API_URL}. Check that your backend is running on port 5000.`,
    );
  }

  const result: unknown = await response.json().catch(() => ({}));

  if (response.status === 401 || response.status === 403) {
    throw new Error("SESSION_EXPIRED");
  }

  if (!response.ok) {
    const data = result as { message?: string; error?: string };

    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}.`,
    );
  }

  return result as T;
}

function getApiProfile(result: ApiResult): ApiProfile | undefined {
  return result.profile ?? result.vendor ?? result.data;
}

function normalizeProfile(input?: ApiProfile): VendorProfile {
  return {
    contactName:
      input?.contactName ?? input?.contact_name ?? input?.fullName ??
      input?.contactPerson ?? "",
    businessName:
      input?.businessName ?? input?.business_name ?? "",
    email: input?.email ?? "",
    phone: input?.phone ?? "",
    businessType: input?.businessType || "Other",
    registrationNumber: input?.registrationNumber ?? "",
    address: input?.address ?? "",
    city: input?.city ?? "",
    province: input?.province ?? "",
    postalCode: input?.postalCode ?? "",
    description: input?.description ?? "",
  };
}

function validate(profile: VendorProfile): FieldErrors {
  const errors: FieldErrors = {};

  if (!profile.contactName.trim()) {
    errors.contactName = "Contact person is required.";
  }

  if (!profile.businessName.trim()) {
    errors.businessName = "Business name is required.";
  }

  if (!profile.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!profile.phone.trim()) {
    errors.phone = "Mobile number is required.";
  } else if (!/^9[678]\d{8}$/.test(profile.phone)) {
    errors.phone = "Enter a valid 10-digit Nepal mobile number.";
  }

  if (!profile.address.trim()) {
    errors.address = "Street / area is required.";
  }

  if (!profile.city.trim()) {
    errors.city = "City is required.";
  }

  if (!profile.province.trim()) {
    errors.province = "Please select a province.";
  }

  return errors;
}

function Required() {
  return <span className="text-[#B77900]">*</span>;
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  disabled,
  required = false,
  type = "text",
  placeholder = "",
  icon,
  error,
  inputMode,
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <Required />}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827B70]">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          placeholder={disabled && !value ? "—" : placeholder}
          inputMode={inputMode}
          maxLength={maxLength ?? (type === "email" ? 254 : 150)}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClass} ${icon ? "pl-10" : ""} ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-[#DED8CC]"
          }`}
        />
      </div>

      <FieldError id={id} message={error} />
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F1D98F] bg-[#FFF7DF] text-[#8E6100]">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-bold sm:text-lg">{title}</h3>
        <p className="mt-0.5 text-sm leading-5 text-[#777167]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function VendorProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<VendorProfile>(emptyProfile);
  const [savedProfile, setSavedProfile] =
    useState<VendorProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const changed = JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const locked = !editing || saving;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest<ApiResult>("/api/vendor/profile");
      const next = normalizeProfile(getApiProfile(result));

      setProfile(next);
      setSavedProfile(next);
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        router.replace("/vendor/login");
        return;
      }

      setError(
        err instanceof Error ? err.message : "Unable to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!editing || !changed) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [editing, changed]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function update<K extends keyof VendorProfile>(
    key: K,
    value: VendorProfile[K],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
    setNotice("");

    setFieldErrors((current) => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function startEditing() {
    setError("");
    setNotice("");
    setFieldErrors({});
    setEditing(true);
  }

  function cancelEditing() {
    setProfile(savedProfile);
    setEditing(false);
    setError("");
    setNotice("");
    setFieldErrors({});
  }

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      await apiRequest("/api/vendor/logout", { method: "POST" });
    } catch (err) {
      // Navigate to login even if the backend logout endpoint is unavailable.
      console.error("Vendor logout request failed:", err);
    } finally {
      router.replace("/vendor/login");
      router.refresh();
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload: VendorProfile = {
      ...profile,
      contactName: profile.contactName.trim(),
      businessName: profile.businessName.trim(),
      email: profile.email.trim().toLowerCase(),
      phone: profile.phone.trim(),
      businessType: profile.businessType.trim(),
      registrationNumber: profile.registrationNumber.trim(),
      address: profile.address.trim(),
      city: profile.city.trim(),
      province: profile.province.trim(),
      postalCode: profile.postalCode.trim(),
      description: profile.description.trim(),
    };

    const errors = validate(payload);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields and try again.");
      scrollToTop();
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest<ApiResult>("/api/vendor/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const returnedProfile = getApiProfile(result);
      let next: VendorProfile;

      if (returnedProfile) {
        next = normalizeProfile(returnedProfile);
      } else {
        const refreshed =
          await apiRequest<ApiResult>("/api/vendor/profile");

        const refreshedProfile = getApiProfile(refreshed);

        if (!refreshedProfile) {
          throw new Error(
            "The profile was submitted, but the server returned no profile data.",
          );
        }

        next = normalizeProfile(refreshedProfile);
      }

      setProfile(next);
      setSavedProfile(next);
      setEditing(false);
      setFieldErrors({});
      setNotice(result.message || "Your profile was saved successfully.");
      scrollToTop();
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        router.replace("/vendor/login");
        return;
      }

      setError(
        err instanceof Error ? err.message : "Unable to save your profile.",
      );
      scrollToTop();
    } finally {
      setSaving(false);
    }
  }

  const initials =
    savedProfile.businessName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "AC";

  return (
    <main className="min-h-screen bg-[#FEF8EB] px-4 py-6 text-[#171717] sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/vendor/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6D675C] transition hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A66C00]">
              Vendor account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Business profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#716C63] sm:text-base">
              View and update your contact information, business details, and
              courier pickup address.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                disabled={loading || !!error || loggingOut}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FBB501] px-5 py-3 text-sm font-bold text-[#171717] shadow-sm transition hover:bg-[#EBA900] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserRound size={17} />
                Edit profile
              </button>
            )}

            <button
              type="button"
              onClick={() => void logout()}
              disabled={loggingOut}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#DCD6CA] bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#F8F5EE] disabled:opacity-60"
            >
              {loggingOut ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <LogOut size={17} />
              )}
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800"
          >
            <CircleAlert size={19} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Unable to complete the request</p>
              <p className="mt-1 break-words">{error}</p>

              {!editing && (
                <button
                  type="button"
                  onClick={() => void loadProfile()}
                  className="mt-2 font-semibold underline underline-offset-4"
                >
                  Try again
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-[#E8E1D4] bg-white shadow-[0_12px_40px_rgba(35,29,15,0.06)]">
          <div className="relative overflow-hidden bg-[#171B1F] px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-8 -top-20 h-60 w-60 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-1 -top-12 h-44 w-44 rounded-full border border-[#FBB501]/25" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#FBB501]/40 bg-[#FBB501] text-2xl font-black text-[#171717]">
                {loading ? (
                  <LoaderCircle size={26} className="animate-spin" />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FBB501]">
                  Vendor account
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
                  {loading
                    ? "Loading profile..."
                    : savedProfile.businessName || "Your business"}
                </h2>

                <p className="mt-2 break-words text-sm text-white/70">
                  {savedProfile.contactName || "Contact person"}
                  {savedProfile.email ? ` · ${savedProfile.email}` : ""}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/85">
                {editing ? (
                  <>
                    <UserRound size={16} className="text-[#FBB501]" />
                    Editing
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} className="text-[#FBB501]" />
                    Protected account
                  </>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-5 p-6 sm:p-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-[#F2F0EA]"
                />
              ))}
            </div>
          ) : (
            <form onSubmit={saveProfile} noValidate>
              <div className="space-y-10 p-5 sm:p-8 lg:p-9">
                <section>
                  <SectionHeader
                    icon={<UserRound size={19} />}
                    title="Contact information"
                    description="Your primary contact details."
                  />

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <Field
                      id="contactName"
                      label="Contact person"
                      value={profile.contactName}
                      required
                      autoComplete="name"
                      disabled={locked}
                      error={fieldErrors.contactName}
                      onChange={(value) => update("contactName", value)}
                    />

                    <Field
                      id="businessName"
                      label="Business name"
                      value={profile.businessName}
                      required
                      autoComplete="organization"
                      disabled={locked}
                      error={fieldErrors.businessName}
                      onChange={(value) => update("businessName", value)}
                    />

                    <Field
                      id="email"
                      label="Email address"
                      type="email"
                      value={profile.email}
                      required
                      autoComplete="email"
                      icon={<Mail size={16} />}
                      disabled={locked}
                      error={fieldErrors.email}
                      onChange={(value) => update("email", value)}
                    />

                    <Field
                      id="phone"
                      label="Mobile number"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={profile.phone}
                      required
                      placeholder="98XXXXXXXX"
                      autoComplete="tel"
                      icon={<Phone size={16} />}
                      disabled={locked}
                      error={fieldErrors.phone}
                      onChange={(value) =>
                        update("phone", value.replace(/\D/g, "").slice(0, 10))
                      }
                    />
                  </div>
                </section>

                <section>
                  <SectionHeader
                    icon={<Building2 size={19} />}
                    title="Business information"
                    description="Additional details about your business."
                  />

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="businessType" className={labelClass}>
                        Business type
                      </label>

                      <select
                        id="businessType"
                        disabled={locked}
                        value={profile.businessType}
                        onChange={(event) =>
                          update("businessType", event.target.value)
                        }
                        className={`${inputClass} border-[#DED8CC]`}
                      >
                        {!businessTypes.includes(profile.businessType) &&
                          profile.businessType && (
                            <option value={profile.businessType}>
                              {profile.businessType}
                            </option>
                          )}

                        {businessTypes.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Field
                      id="registrationNumber"
                      label="Registration number"
                      value={profile.registrationNumber}
                      disabled={locked}
                      placeholder="Optional"
                      onChange={(value) =>
                        update("registrationNumber", value)
                      }
                    />

                    <div className="md:col-span-2">
                      <label htmlFor="description" className={labelClass}>
                        Business description
                      </label>

                      <textarea
                        id="description"
                        rows={4}
                        maxLength={1000}
                        disabled={locked}
                        value={profile.description}
                        onChange={(event) =>
                          update("description", event.target.value)
                        }
                        placeholder={
                          editing
                            ? "Briefly describe your business..."
                            : "—"
                        }
                        className={`${inputClass} resize-y border-[#DED8CC]`}
                      />

                      {editing && (
                        <p className="mt-1.5 text-right text-xs text-[#817B70]">
                          {profile.description.length}/1000
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <SectionHeader
                    icon={<MapPin size={19} />}
                    title="Business address"
                    description="Your primary courier pickup location."
                  />

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Field
                        id="address"
                        label="Street / area"
                        value={profile.address}
                        required
                        autoComplete="street-address"
                        disabled={locked}
                        error={fieldErrors.address}
                        onChange={(value) => update("address", value)}
                      />
                    </div>

                    <Field
                      id="city"
                      label="City"
                      value={profile.city}
                      required
                      autoComplete="address-level2"
                      disabled={locked}
                      error={fieldErrors.city}
                      onChange={(value) => update("city", value)}
                    />

                    <div>
                      <label htmlFor="province" className={labelClass}>
                        Province <Required />
                      </label>

                      <select
                        id="province"
                        required
                        disabled={locked}
                        value={profile.province}
                        onChange={(event) =>
                          update("province", event.target.value)
                        }
                        aria-invalid={!!fieldErrors.province}
                        aria-describedby={
                          fieldErrors.province ? "province-error" : undefined
                        }
                        className={`${inputClass} ${
                          fieldErrors.province
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-[#DED8CC]"
                        }`}
                      >
                        <option value="">Select province</option>

                        {!provinces.includes(profile.province) &&
                          profile.province && (
                            <option value={profile.province}>
                              {profile.province}
                            </option>
                          )}

                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>

                      <FieldError
                        id="province"
                        message={fieldErrors.province}
                      />
                    </div>

                    <Field
                      id="postalCode"
                      label="Postal code"
                      value={profile.postalCode}
                      disabled={locked}
                      placeholder="Optional"
                      autoComplete="postal-code"
                      onChange={(value) => update("postalCode", value)}
                    />
                  </div>
                </section>
              </div>

              {editing && (
                <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#E8E1D4] bg-white/95 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <p className="flex items-center gap-2 text-xs text-[#777167]">
                    <LockKeyhole size={14} />
                    {changed
                      ? "You have unsaved changes."
                      : "No unsaved changes."}
                  </p>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DCD6CA] px-5 py-3 text-sm font-semibold transition hover:bg-[#F8F5EE] disabled:opacity-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving || !changed}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FBB501] px-5 py-3 text-sm font-bold text-[#171717] shadow-sm transition hover:bg-[#EBA900] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Save size={17} />
                      )}
                      {saving ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </section>

        <section className="flex gap-4 rounded-2xl border border-[#E8E1D4] bg-white p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF3CF] text-[#936300]">
            <Store size={21} />
          </div>

          <div>
            <h3 className="font-bold">Aarambha Courier vendor profile</h3>
            <p className="mt-1 text-sm leading-6 text-[#716C63]">
              Keep your details accurate so courier pickups and account
              communication can be coordinated smoothly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
