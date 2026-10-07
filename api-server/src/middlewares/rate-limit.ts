/**
 * Minimal fixed-window rate limiter.
 *
 * Implemented in-process on purpose: the checkout, contact and track-order
 * endpoints were previously completely unthrottled, which allows an anonymous
 * attacker to burn Stripe API quota, flood the orders table, or brute-force the
 * order-id + email pair used by `GET /api/track-order`.
 *
 * A shared store (Redis) would be required for a multi-instance deployment; the
 * per-instance behaviour is still strictly better than no limit at all.
 */

import type { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Length of the window in milliseconds. */
  windowMs: number;
  /** Maximum number of requests allowed per window, per key. */
  max: number;
  /** Bucket name, used to keep separate endpoints on separate counters. */
  name: string;
  /** Return 429 instead of silently dropping. Defaults to true. */
  reject?: boolean;
}

const buckets = new Map<string, Bucket>();

/** Evict expired buckets so a burst of unique keys cannot grow the map forever. */
function sweep(now: number): void {
  if (buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function clientKey(req: Request): string {
  // `req.ip` honours X-Forwarded-For only when `trust proxy` is configured.
  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Create a rate-limiting middleware.
 */
export function rateLimit({
  windowMs,
  max,
  name,
  reject = true,
}: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    sweep(now);

    const key = `${name}:${clientKey(req)}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", String(max - 1));
      next();
      return;
    }

    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));

      if (reject) {
        res.status(429).json({
          error: {
            message: "Too many requests. Please slow down and try again shortly.",
            statusCode: 429,
          },
        });
        return;
      }
    }

    next();
  };
}

/** Clear all counters (used by tests). */
export function resetRateLimits(): void {
  buckets.clear();
}