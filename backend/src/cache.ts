import { createCache } from "@lacspace/cache";
import { Redis } from "ioredis";
import { env } from "./env.js";

// how this works: one cache interface, TWO backends. If REDIS_URL is set we use
// Redis; otherwise we fall back to @lacspace/cache (zero-dep, in-memory) so the app
// runs with NO Redis at all. The rest of the code doesn't care which is active.
export interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  readonly kind: "redis" | "memory";
}

function redisCache(url: string): Cache {
  const client = new Redis(url, { maxRetriesPerRequest: 2 });
  client.on("error", (e: Error) => console.warn("⚠ Redis error:", e.message));
  return {
    kind: "redis",
    async get(key) { return client.get(key); },
    async set(key, value, ttl) { if (ttl) await client.set(key, value, "EX", ttl); else await client.set(key, value); },
    async del(key) { await client.del(key); },
  };
}

function memoryCache(): Cache {
  const mem = createCache<string>({ max: 5000 });
  return {
    kind: "memory",
    async get(key) { return mem.get(key) ?? null; },
    async set(key, value, ttl) { mem.set(key, value, ttl ? ttl * 1000 : undefined); },
    async del(key) { mem.delete(key); },
  };
}

export const cache: Cache = env.REDIS_URL ? redisCache(env.REDIS_URL) : memoryCache();
console.log(`✔ Cache: ${cache.kind}${cache.kind === "memory" ? " (no REDIS_URL — in-memory fallback)" : ""}`);
