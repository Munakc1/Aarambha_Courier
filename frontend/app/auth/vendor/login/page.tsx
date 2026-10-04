
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  Truck,
} from "lucide-react";

export default function VendorLoginPage() {
  return (
    <main className="min-h-screen bg-app">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent-orange"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="rounded-3xl border border-hairline bg-white-soft p-6 shadow-xl dark:bg-surface sm:p-8">
            {/* Logo / Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-dark-1 shadow-sm">
                <Truck size={30} strokeWidth={2.2} />
              </div>
            </div>

            {/* Heading */}
            <div className="mt-6 text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-accent-orange">
                VENDOR PORTAL
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-fg">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                Sign in to manage your shipments and vendor account.
              </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-5">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                    className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    className="text-xs font-semibold text-accent-orange hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-hairline accent-primary"
                />
                Remember me
              </label>

              {/* Login Button */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Sign In
              </button>
            </form>

            {/* Register */}
            <div className="mt-7 border-t border-hairline pt-6 text-center">
              <p className="text-sm text-muted">
                Don't have a vendor account?
              </p>

              <Link
                href="/vendor/register"
                className="mt-2 inline-block text-sm font-bold text-fg transition hover:text-accent-orange"
              >
                Create Vendor Account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted">
            © {new Date().getFullYear()} Aarambha Courier & Transport Service
            Pvt. Ltd.
          </p>
        </div>
      </div>
    </main>
  );
}
