import { createEnv, str, port, oneOf } from "@lacspace/env";

// how this works: fail-fast, TYPED environment variables (@lacspace/env). Bad or
// missing values throw at boot with a clear message. Sensible dev defaults mean it
// runs with zero config against a local MongoDB; set real values in the root .env.
export const env = createEnv({
  NODE_ENV: oneOf(["development", "production", "test"], { default: "development" }),
  PORT: port({ default: 4000 }),
  MONGODB_URI: str({ default: "mongodb://localhost:27017/ammrambha_courier" }),
  JWT_SECRET: str({ default: "dev-secret-change-me" }),
  REDIS_URL: str({ optional: true }),
  CORS_ORIGIN: str({ default: "http://localhost:3000" }),
});

if (env.NODE_ENV === "production" && env.JWT_SECRET === "dev-secret-change-me") {
  throw new Error("Set a strong JWT_SECRET in production (see .env.example).");
}
