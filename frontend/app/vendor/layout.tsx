"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  Upload,
  Truck,
  Wallet,
  ArrowLeftRight,
  RotateCcw,
  FileText,
  ChartNoAxesColumn,
  UserRound,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
  Building2,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const COLLAPSE_KEY = "vendor-sidebar-collapsed";

type VendorUser = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  businessName?: string;
  companyName?: string;
  email?: string;
  role?: string;
  status?: string;
  approvalStatus?: string;
  vendor?: VendorUser;
  user?: VendorUser;
};

type ApiPayload = {
  message?: string;
  data?: VendorUser;
  user?: VendorUser;
  vendor?: VendorUser;
};

const navigation = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { label: "Shipments", href: "/vendor/shipments", icon: Package },
  { label: "Create Shipment", href: "/vendor/shipments/new", icon: Plus },
  { label: "Bulk Upload", href: "/vendor/shipments/bulk", icon: Upload },
  { label: "Pickups", href: "/vendor/pickups", icon: Truck },
  { label: "COD Ledger", href: "/vendor/cod", icon: Wallet },
  { label: "Settlements", href: "/vendor/settlements", icon: ArrowLeftRight },
  { label: "Returns", href: "/vendor/returns", icon: RotateCcw },
  { label: "Invoices", href: "/vendor/invoices", icon: FileText },
  { label: "Reports", href: "/vendor/reports", icon: ChartNoAxesColumn },
  { label: "Profile", href: "/vendor/profile", icon: UserRound },
];

async function readResponse(response: Response): Promise<ApiPayload> {
  return response.json().catch(() => ({}));
}

function getUser(payload: ApiPayload): VendorUser | null {
  const candidate = payload.data ?? payload.user ?? payload.vendor;

  if (!candidate) return null;

  return candidate.vendor ?? candidate.user ?? candidate;
}

function getApprovalStatus(user: VendorUser): string {
  return String(user.approvalStatus ?? user.status ?? "")
    .trim()
    .toUpperCase();
}

function isApproved(user: VendorUser): boolean {
  const status = getApprovalStatus(user);

  // If the existing API doesn't expose approval status, don't invent one.
  // Backend authorization must still enforce approval for protected actions.
  return !status || status === "APPROVED";
}

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/vendor/dashboard") {
    return pathname === href;
  }

  // "Shipments" must not stay highlighted on /new or /bulk
  if (href === "/vendor/shipments") {
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) &&
        !pathname.startsWith("/vendor/shipments/new") &&
        !pathname.startsWith("/vendor/shipments/bulk"))
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(user: VendorUser | null): string {
  const name =
    user?.businessName ||
    user?.companyName ||
    user?.fullName ||
    user?.name ||
    user?.email ||
    "Vendor";

  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function VendorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<VendorUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [authError, setAuthError] = useState("");

  // Restore the desktop collapsed state (after mount to avoid hydration mismatch)
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* storage unavailable: keep default */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const loadUser = useCallback(async () => {
    setLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_URL}/api/vendor/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (response.status === 401 || response.status === 403) {
        router.replace("/vendor/login");
        return;
      }

      const payload = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          payload.message || "Unable to verify your vendor account."
        );
      }

      const authenticatedUser = getUser(payload);

      if (!authenticatedUser) {
        throw new Error(
          "The vendor profile response has an unexpected format."
        );
      }

      const role = String(authenticatedUser.role || "").toUpperCase();

      if (role && role !== "VENDOR") {
        const destination =
          role === "ADMIN"
            ? "/dashboard/admin"
            : role === "RIDER"
              ? "/rider/dashboard"
              : "/vendor/login";

        router.replace(destination);
        return;
      }

      setUser(authenticatedUser);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  // Close drawer and menu after navigation
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Stop the page behind the drawer from scrolling
  useEffect(() => {
    if (!mobileOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/logout`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      // A 401 means the session is already invalid.
      if (!response.ok && response.status !== 401) {
        throw new Error("Logout failed. Please try again.");
      }

      router.replace("/vendor/login");
      router.refresh();
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to log out."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted">
            Verifying your vendor account...
          </p>
        </div>
      </div>
    );
  }

  if (authError && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-dark-1">
            Unable to open your dashboard
          </h1>
          <p className="mt-2 break-words text-sm leading-6 text-gray-600">
            {authError}
          </p>
          <button
            type="button"
            onClick={() => void loadUser()}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-dark-1 hover:bg-accent-orange focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/vendor/login"
            className="mt-4 block text-center text-sm font-medium text-gray-600 underline underline-offset-4"
          >
            Return to vendor login
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isApproved(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-lg rounded-2xl border border-primary/40 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-dark-1">
            <Clock className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-dark-1">
            Your account is awaiting approval
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your vendor account is not yet approved for dashboard operations.
            Please check again after the administrator reviews your account.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Current status: {getApprovalStatus(user) || "Pending review"}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-dark-1 px-5 py-3 text-sm font-semibold text-white hover:bg-dark-2"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    );
  }

  const businessName =
    user.businessName ||
    user.companyName ||
    user.fullName ||
    user.name ||
    "Vendor Account";

  return (
    <div className="min-h-screen bg-cream text-dark-1">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="vendor-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-gray-200 bg-white transition-all duration-200 ${collapsed ? "lg:w-[84px]" : "lg:w-[270px]"
          } lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar header */}
        <div
          className={`flex h-[76px] shrink-0 items-center border-b border-gray-100 px-5 ${collapsed ? "justify-between lg:justify-center lg:px-2" : "justify-between"
            }`}
        >
          <Link
            href="/vendor/dashboard"
            aria-label="Aarambha Courier dashboard"
            className={`group flex min-w-0 items-center ${collapsed ? "lg:hidden" : ""
              }`}
          >
            <Image
              src="/images/logo.png"
              alt="Aarambha Courier"
              width={200}
              height={50}
              priority
              className="h-[43px] w-auto transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Mobile: close drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-dark-1 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop: collapse / expand */}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:border-primary hover:bg-primary/10 hover:text-dark-1 lg:inline-flex"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Vendor navigation"
          className={`flex-1 space-y-1 overflow-y-auto px-3 py-4 ${collapsed ? "lg:px-2" : ""
            }`}
        >
          <p
            className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.17em] text-gray-400 ${collapsed ? "lg:hidden" : ""
              }`}
          >
            Workspace
          </p>

          {navigation.map(({ label, href, icon: Icon }) => {
            const active = isActiveRoute(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${collapsed ? "lg:justify-center lg:px-0" : ""
                  } ${active
                    ? "bg-primary font-bold text-dark-1"
                    : "text-gray-600 hover:bg-primary/10 hover:text-dark-1"
                  }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span
                  className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}
                >
                  {label}
                </span>
                {active && (
                  <ChevronRight
                    className={`h-4 w-4 ${collapsed ? "lg:hidden" : ""}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        {/* Sidebar footer */}
        <div
          className={`shrink-0 border-t border-gray-100 p-4 ${collapsed ? "lg:px-2" : ""
            }`}
        >
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            aria-label="Log out"
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 ${collapsed ? "lg:px-0" : ""
              }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>
              Log out
            </span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div
        className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "lg:pl-[84px]" : "lg:pl-[270px]"
          }`}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
              aria-controls="vendor-sidebar"
              aria-expanded={mobileOpen}
              className="rounded-xl border border-gray-200 p-2 hover:bg-gray-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              {/* <p className="truncate text-sm font-bold sm:text-base">
                {businessName}
              </p> */}
              {/* <p className="hidden text-xs text-gray-500 sm:block">
                Vendor operations workspace
              </p> */}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/vendor/notifications"
              aria-label="View notifications"
              className={`relative rounded-xl border p-2.5 transition-colors ${isActiveRoute(pathname, "/vendor/notifications")
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <Bell className="h-[18px] w-[18px]" />
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 p-1.5 pr-2.5 hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-dark-1">
                  {getInitials(user)}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
              </button>

              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-3 py-3">
                      <p className="truncate text-sm font-bold">
                        {businessName}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {user.email || "Vendor account"}
                      </p>
                    </div>

                    <Link
                      href="/vendor/profile"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50"
                    >
                      <UserRound className="h-4 w-4" />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {authError && user && (
          <div
            role="alert"
            className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-6 lg:mx-8"
          >
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError("")}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}