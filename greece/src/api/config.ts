/**
 * API configuration management
 */

import type { AuthTokenGetter } from "./types";

const DEFAULT_JSON_ACCEPT = "application/json, application/problem+json";

// Module-level configuration
let _baseUrl: string | null = null;
let _authTokenGetter: AuthTokenGetter | null = null;

/**
 * Set a base URL that is prepended to every relative request URL
 * (i.e. paths that start with `/`).
 *
 * Useful for Expo bundles that need to call a remote API server.
 * Pass `null` to clear the base URL.
 */
export function setBaseUrl(url: string | null): void {
  _baseUrl = url ? url.replace(/\/+$/, "") : null;
}

/**
 * Get the current base URL
 */
export function getBaseUrl(): string | null {
  return _baseUrl;
}

/**
 * Register a getter that supplies a bearer auth token. Before every fetch
 * the getter is invoked; when it returns a non-null string, an
 * `Authorization: Bearer <token>` header is attached to the request.
 *
 * Useful for Expo bundles making token-gated API calls.
 * Pass `null` to clear the getter.
 *
 * NOTE: This function should never be used in web applications where session
 * token cookies are automatically associated with API calls by the browser.
 */
export function setAuthTokenGetter(getter: AuthTokenGetter | null): void {
  _authTokenGetter = getter;
}

/**
 * Get the current auth token getter
 */
export function getAuthTokenGetter(): AuthTokenGetter | null {
  return _authTokenGetter;
}

/**
 * Get the default JSON accept header
 */
export function getDefaultJsonAccept(): string {
  return DEFAULT_JSON_ACCEPT;
}
