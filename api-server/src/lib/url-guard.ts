/**
 * Redirect URL allow-listing.
 *
 * `successUrl` / `cancelUrl` are forwarded verbatim to Stripe as `success_url` /
 * `cancel_url`. Without validation that turns the checkout endpoint into an open
 * redirect (and a phishing surface), because an attacker can point the redirect
 * at a look-alike domain and Stripe will happily send the buyer there.
 *
 * The rule is: the URL's origin must appear in the configured allow-list.
 */

import { env } from "./env";

/** Local origins that are always permitted (development / preview tooling). */
const LOCAL_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8081",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:8081",
]);

function normaliseOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Build the set of origins that may receive a checkout redirect.
 *
 * `FRONTEND_URL` / `CORS_ORIGIN` may contain a comma-separated list.
 */
function collectAllowedOrigins(): Set<string> {
  const allowed = new Set<string>();

  for (const value of [env.frontendUrl, env.corsOrigin]) {
    if (!value) continue;
    for (const entry of value.split(",")) {
      const trimmed = entry.trim();
      if (!trimmed) continue;
      const origin = normaliseOrigin(trimmed);
      if (origin) allowed.add(origin);
    }
  }

  return allowed;
}

/**
 * The mobile app (Expo) completes checkout through a deep link back into the
 * app. Its custom URL scheme is acceptable as a redirect target, but it is
 * matched against an explicit allow-list rather than trusted wholesale.
 */
const APP_REDIRECT_SCHEMES = new Set(
  (process.env.APP_URL_SCHEMES ?? "greece:,greece-mobile:")
    .split(",")
    .map((scheme) => scheme.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * Throw unless `candidate` points at an allow-listed origin.
 *
 * In non-production we additionally permit loopback origins so the local Vite
 * dev server can complete a checkout.
 */
export function assertAllowedRedirect(candidate: string, field: string): string {
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw Object.assign(new Error(`${field} must be a valid absolute URL`), {
      statusCode: 400,
    });
  }

  // Native deep links (e.g. the Expo app's `greece://` scheme) carry no
  // network origin, so they are matched by scheme against the allow-list.
  if (
    parsed.protocol !== "http:" &&
    parsed.protocol !== "https:" &&
    APP_REDIRECT_SCHEMES.has(parsed.protocol)
  ) {
    return candidate;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw Object.assign(
      new Error(`${field} uses a disallowed scheme (${parsed.protocol})`),
      { statusCode: 400 },
    );
  }

  const origin = `${parsed.protocol}//${parsed.host}`.toLowerCase();
  const allowed = collectAllowedOrigins();

  const isAllowed =
    allowed.has(origin) || (env.isDevelopment && LOCAL_ORIGINS.has(origin));

  if (!isAllowed) {
    throw Object.assign(
      new Error(`${field} points at a disallowed origin (${origin})`),
      { statusCode: 400 },
    );
  }

  return candidate;
}