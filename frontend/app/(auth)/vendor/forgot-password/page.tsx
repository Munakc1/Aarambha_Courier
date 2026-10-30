
"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Mail,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

export default function VendorForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/vendor/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to process your request. Please try again."
        );
      }

      /*
       * The backend now sends the reset link
       * directly to the vendor's email.
       *
       * We intentionally do NOT receive or display
       * the reset token in the frontend.
       */
      setSuccess(true);
    } catch (err) {
      console.error(
        "Forgot password error:",
        err
      );

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
        <div className="w-full max-w-md">

          {/* Back to Login */}
          <Link
            href="/vendor/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent-orange"
          >
            <ArrowLeft size={17} />
            Back to Login
          </Link>

          {/* Card */}
          <div className="rounded-3xl border border-hairline bg-white-soft p-6 shadow-xl dark:bg-surface sm:p-8">

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

            {/* Icon */}
            <div className="mt-7 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-badge text-primary">
                {success ? (
                  <CheckCircle2 size={26} />
                ) : (
                  <LockKeyhole size={26} />
                )}
              </div>
            </div>

            {/* Heading */}
            <div className="mt-5 text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-accent-orange">
                VENDOR PORTAL
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-fg">
                Forgot Password?
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                Enter the email address associated with
                your vendor account and we&apos;ll send
                you a password reset link.
              </p>
            </div>

            {!success ? (
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-fg"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Sending Reset Link..."
                    : "Send Reset Link"}
                </button>
              </form>
            ) : (
              /* Success State */
              <div
                role="status"
                aria-live="polite"
                className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5"
              >
                <div className="flex justify-center">
                  <CheckCircle2
                    size={32}
                    className="text-green-600"
                  />
                </div>

                <h2 className="mt-3 text-center text-base font-bold text-green-800">
                  Check Your Email
                </h2>

                <p className="mt-2 text-center text-sm leading-6 text-green-700">
                  If an account exists for{" "}
                  <span className="font-bold">
                    {email.trim().toLowerCase()}
                  </span>
                  , we&apos;ve sent a password reset link.
                </p>

                <p className="mt-3 text-center text-xs leading-5 text-green-700">
                  The reset link is valid for 15 minutes.
                  Please check your spam or junk folder if
                  you don&apos;t see the email.
                </p>

                <Link
                  href="/vendor/login"
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Back to Sign In
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="mt-7 border-t border-hairline pt-6 text-center">
              <p className="text-sm text-muted">
                Remember your password?
              </p>

              <Link
                href="/vendor/login"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-fg transition hover:text-accent-orange"
              >
                <LockKeyhole size={16} />
                Back to Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
