import { config } from "dotenv";
import { resolve } from "node:path";

// how this works: the whole monorepo shares ONE .env at the repo root. When this
// API runs via `npm run dev` its working directory is backend/, so the root .env
// is one level up. This module is imported FIRST (before env.ts) so the variables
// exist by the time anything reads them.
config({ path: resolve(process.cwd(), "../.env") });
config(); // also load backend/.env if you keep one (root values already set win)
