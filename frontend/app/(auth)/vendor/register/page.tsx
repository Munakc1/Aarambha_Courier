
"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const inputClass =
  "h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20";

const iconClass =
  "absolute left-4 top-1/2 -translate-y-1/2 text-muted";

const labelClass = "mb-2 block text-sm font-semibold text-fg";

export default function VendorRegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const form = new FormData(e.currentTarget);

    const fullName = String(form.get("fullName") ?? "").trim();
    const businessName = String(form.get("businessName") ?? "").trim();
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const phone = String(form.get("phone") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const terms = form.get("terms") === "on";

    // Frontend validation
    if (!fullName || !businessName || !email || !phone || !address) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Nepal mobile number validation
    if (!/^9[678]\d{8}$/.test(phone)) {
      setError("Please enter a valid Nepal mobile number.");
      return;
    }

    if (!terms) {
      setError("Please accept the vendor terms and conditions.");
      return;
    }

    if (!API_URL) {
      setError("API configuration is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/vendor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          businessName,
          email,
          phone,
          address,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create vendor account."
        );
      }

      // Registration successful.
      // Backend can either automatically log the vendor in
      // or simply return success.
      router.push("/vendor/login?registered=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-app">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Back to Home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent-orange"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          {/* Register Card */}
          <div className="rounded-3xl border border-hairline bg-white-soft p-6 shadow-xl dark:bg-surface sm:p-8 lg:p-10">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Aarambha Courier — home"
              className="group flex justify-center"
            >
              <Image
                src="/images/logo.png"
                alt="Aarambha Courier"
                width={200}
                height={50}
                priority
                className="h-[43px] w-auto transition-transform duration-300 group-hover:scale-[1.02] xl:h-[50px]"
              />
            </Link>

            {/* Heading */}
            <div className="mt-6 text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-accent-orange">
                VENDOR PORTAL
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-fg">
                Create Vendor Account
              </h1>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
                Register your business with Aarambha Courier to manage your
                shipments and deliveries.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Full Name + Business Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name
                  </label>

                  <div className="relative">
                    <User size={18} className={iconClass} />

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessName" className={labelClass}>
                    Business Name
                  </label>

                  <div className="relative">
                    <Building2 size={18} className={iconClass} />

                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Your business name"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail size={18} className={iconClass} />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone size={18} className={iconClass} />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="98XXXXXXXX"
                      pattern="9[678][0-9]{8}"
                      maxLength={10}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className={labelClass}>
                  Business Address
                </label>

                <div className="relative">
                  <Building2 size={18} className={iconClass} />

                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your business address"
                    autoComplete="street-address"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password + Confirm Password */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={18} className={iconClass} />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create password"
                      required
                      minLength={8}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole size={18} className={iconClass} />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      required
                      minLength={8}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-hairline accent-primary"
                />

                <span className="text-xs leading-5 text-muted">
                  I agree to the vendor terms and conditions and confirm that
                  the information provided is accurate.
                </span>
              </label>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Vendor Account"}
              </button>
            </form>

            {/* Login */}
            <div className="mt-7 border-t border-hairline pt-6 text-center">
              <p className="text-sm text-muted">
                Already have a vendor account?
              </p>

              <Link
                href="/vendor/login"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-fg transition hover:text-accent-orange"
              >
                <LockKeyhole size={16} />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
