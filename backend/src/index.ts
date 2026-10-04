import "./load-env.js"; // MUST be first: fills process.env before anything reads it
import { env } from "./env.js";
import { connectDb } from "./db.js";
import { createApp } from "./app.js";
import { log } from "./logger.js";

// how this works: connect to MongoDB, build the Express app, then listen.
async function main(): Promise<void> {
  await connectDb(env.MONGODB_URI);
  const app = createApp();
  app.listen(env.PORT, () => {
    log.info("ammrambha_courier API ready", { url: `http://localhost:${env.PORT}` });
  });
}

main().catch((err) => {
  log.fatal("Failed to start the API", { err });
  process.exit(1);
});
