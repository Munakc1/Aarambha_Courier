import { toNextHeaders } from "@lacspace/headers";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve under a sub-path (e.g. a templates.lacspace.com/<name> demo) by setting
  // NEXT_PUBLIC_BASE_PATH at build time; leave it unset for a normal standalone app.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  async headers() {
    // Hardened security headers (HSTS, CSP, X-Frame-Options, …) from @lacspace/headers
    return toNextHeaders();
  },
};

export default nextConfig;
