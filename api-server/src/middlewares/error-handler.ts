/**
 * Global error handler middleware
 * Catches and formats all errors in a consistent way
 */

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";
import { env } from "../lib/env";

export interface ApiError extends Error {
  statusCode?: number;
  details?: Record<string, any>;
}

/** Status codes that are safe to show the caller verbatim. */
function isClientStatus(status: number): boolean {
  return status >= 400 && status < 500;
}

export const errorHandler = (
  err: ApiError & { status?: number; type?: string },
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Once headers are flushed the only correct action is to destroy the socket.
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode ||
    err.status ||
    // `express.json()` reports a malformed body as a plain SyntaxError.
    (err instanceof SyntaxError && "body" in err ? 400 : 500) ||
    500;

  // `express.json({ limit })` rejects oversized payloads with this `type`.
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: { message: "Request body is too large.", statusCode: 413 },
    });
  }

  const isClient = isClientStatus(statusCode);

  if (isClient) {
    logger.warn({ statusCode, message: err.message }, "Request rejected");
  } else {
    logger.error(
      { statusCode, message: err.message, stack: err.stack, details: err.details },
      "Error occurred"
    );
  }

  /**
   * Never echo a 5xx message to the client: it routinely embeds connection
   * strings, file paths or driver internals. Zod errors are re-expanded because
   * they are already field-level and safe.
   */
  const message =
    isClient || err instanceof ZodError
      ? err.message || "Bad Request"
      : env.isProduction
        ? "Internal Server Error"
        : err.message || "Internal Server Error";

  const details =
    err instanceof ZodError
      ? Object.fromEntries(
          err.issues.map((issue) => [
            issue.path.join(".") || "_",
            issue.message,
          ]),
        )
      : isClient
        ? err.details
        : undefined;

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(details && { details }),
    },
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};