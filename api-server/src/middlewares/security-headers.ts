/**
 * Baseline security response headers.
 *
 * Applied by hand rather than pulling in `helmet` so the bundle stays small and
 * the exact policy is auditable in one place. The storefront is a JSON API plus
 * a Swagger document, so a CSP is not enforced here — it is set by Vercel's
 * `vercel.json` for the HTML app.
 */

import type { NextFunction, Request, Response } from "express";

const DEFAULT_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "no-referrer"],
  ["X-DNS-Prefetch-Control", "off"],
  ["X-Permitted-Cross-Domain-Policies", "none"],
  ["Cross-Origin-Resource-Policy", "same-site"],
  [
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  ],
];

export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  for (const [name, value] of DEFAULT_HEADERS) {
    res.setHeader(name, value);
  }

  // Only meaningful for HTML documents; this API never returns any.
  res.removeHeader("X-Powered-By");

  next();
}