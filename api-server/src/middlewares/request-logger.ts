/**
 * Request logging middleware
 * Logs incoming requests and outgoing responses
 */

import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

/**
 * Query parameters whose values must never reach the log sink.
 *
 * `/api/track-order` takes `?email=…`, so logging the raw query object wrote
 * every customer's email address into the log stream on each lookup.
 */
const SENSITIVE_QUERY_PARAMS = new Set([
  "email",
  "password",
  "token",
  "secret",
  "apikey",
  "api_key",
  "authorization",
]);

function redactQuery(query: Request["query"]): Record<string, unknown> {
  if (!query || typeof query !== "object") return {};

  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    safe[key] = SENSITIVE_QUERY_PARAMS.has(key.toLowerCase()) ? "[redacted]" : value;
  }
  return safe;
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request
  logger.info(
    {
      method: req.method,
      path: req.path,
      query: redactQuery(req.query),
      ip: req.ip,
    },
    "Incoming request"
  );

  // Capture response
  const originalSend = res.send;
  res.send = function (data: unknown) {
    const duration = Date.now() - startTime;
    logger.info(
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      },
      "Request completed"
    );
    return originalSend.call(this, data);
  };

  next();
};