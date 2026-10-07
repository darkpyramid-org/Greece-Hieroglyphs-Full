import app from "./app";
import { logger } from "./lib/logger";
import { env } from "./lib/env";

const port = env.port;

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error(
    `Invalid PORT value: "${process.env["PORT"]}" (expected an integer between 1 and 65535)`,
  );
}

const server = app.listen(port, () => {
  logger.info({ port, env: env.nodeEnv }, "Server listening");
});

/**
 * `app.listen`'s callback never receives an error argument, so a failure such as
 * `EADDRINUSE` was previously swallowed and the process kept running with no
 * listener. Handle it on the server object instead.
 */
server.on("error", (err) => {
  logger.error({ err, port }, "Error listening on port");
  process.exit(1);
});

/** Drain connections so in-flight requests finish before exiting. */
function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down");
  server.close(() => process.exit(0));

  // Don't hang forever on a stuck keep-alive connection.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
