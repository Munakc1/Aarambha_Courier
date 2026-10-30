import path from "path";
import { fileURLToPath } from "url";
import { toNextHeaders } from "@lacspace/headers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve under a sub-path by setting NEXT_PUBLIC_BASE_PATH at build time;
  // leave it unset for a normal standalone app.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  // Silences the "multiple lockfiles" warning and points tracing at the monorepo root
  outputFileTracingRoot: path.join(__dirname, ".."),

  // Only needed if the types package has no build step (raw .ts files)
  transpilePackages: ["@ammrambha_courier/types"],

  async headers() {
    // Hardened security headers (HSTS, CSP, X-Frame-Options, ...) from @lacspace/headers
    return toNextHeaders();
  },
};

export default nextConfig;