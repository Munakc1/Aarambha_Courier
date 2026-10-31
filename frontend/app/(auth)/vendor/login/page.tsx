"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

function VendorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show success message after registration
  // Example: /vendor/login?registered=true
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess(
        "Your vendor account has been created successfully. Please sign in."
      );
    }
  }, [searchParams]);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();

    const password = String(
      form.get("password") ?? ""
    );

    const remember = form.get("remember") === "on";

    // -----------------------------------------
    // FRONTEND VALIDATION
    // -----------------------------------------

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      setLoading(false);
      return;
    }

    // -----------------------------------------
    // LOGIN API REQUEST
    // -----------------------------------------

    try {
      const response = await fetch(
        `${API_URL}/api/vendor/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
            remember,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data: {
        message?: string;
        error?: string;
        success?: boolean;
        vendor?: unknown;
      } | null = null;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          message: text || undefined,
        };
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Invalid email or password."
        );
      }

      // -----------------------------------------
      // LOGIN SUCCESS
      // -----------------------------------------
      //
      // The backend should set the authentication
      // cookie. We intentionally do not store
      // authentication tokens in localStorage.
      //

      router.push("/vendor/dashboard/");
    } catch (err) {
      console.error("Vendor login error:", err);

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running on http://localhost:5000."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-app">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent-orange"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="rounded-3xl border border-hairline bg-white-soft p-6 shadow-xl dark:bg-surface sm:p-8">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Aarambha Courier home"
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
                Welcome Back
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                Sign in to manage your shipments and
                vendor account.
              </p>
            </div>

            {/* Login Form */}
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
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-fg"
                  >
                    Password
                  </label>

                  <Link
                    href="/vendor/forgot-password"
                    className="text-xs font-semibold text-accent-orange transition hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    minLength={8}
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-12 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={18}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="remember"
                  disabled={loading}
                  className="h-4 w-4 rounded border-hairline accent-primary disabled:cursor-not-allowed"
                />

                <span>Remember me</span>
              </label>

              {/* Success Message */}
              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                >
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 border-t border-hairline pt-6 text-center">
              <p className="text-sm text-muted">
                Don&apos;t have a vendor account?
              </p>

              <Link
                href="/vendor/register"
                className="mt-2 inline-block text-sm font-bold text-fg transition hover:text-accent-orange"
              >
                Create Vendor Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function VendorLoginPage() {
  return (
    <Suspense fallback={null}>
      <VendorLoginForm />
    </Suspense>
  );
}