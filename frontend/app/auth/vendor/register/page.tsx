import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  LockKeyhole,
  Mail,
  Phone,
  Truck,
  User,
} from "lucide-react";

export default function VendorRegisterPage() {
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
                Create Vendor Account
              </h1>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
                Register your business with Aarambha Courier to manage your
                shipments and deliveries.
              </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-5">
              {/* Full Name + Business Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-fg"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block text-sm font-semibold text-fg"
                  >
                    Business Name
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Your business name"
                      required
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid gap-5 sm:grid-cols-2">
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
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-fg"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="98XXXXXXXX"
                      required
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-fg"
                >
                  Business Address
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your business address"
                    required
                    className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password + Confirm Password */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-fg"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-fg"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-hairline bg-app pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
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

              {/* Register Button */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-primary px-5 text-sm font-bold text-dark-1 transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Create Vendor Account
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