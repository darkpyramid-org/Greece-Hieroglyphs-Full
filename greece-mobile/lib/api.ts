/**
 * Shared API helpers for the mobile app.
 *
 * Every network call goes through `apiFetch`, which adds:
 *   - a 15s timeout (previously a black-holed connection left the UI spinning
 *     forever),
 *   - response.ok handling + JSON guard (a proxy returning HTML used to surface
 *     as a raw "Unexpected token '<'" error),
 *   - consistent error messages.
 */

import { Platform } from "react-native";
import { getApiBase } from "@/constants/products";

const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    throw new ApiRequestError(
      isAbort
        ? "The request timed out. Please check your connection and try again."
        : "Could not reach the server. Please check your connection.",
    );
  } finally {
    clearTimeout(timer);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    // A proxy / captive portal / wrong host often answers with an HTML page.
    throw new ApiRequestError(
      `Unexpected response from the server (HTTP ${response.status}).`,
      response.status,
    );
  }

  const data = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && data.error) ||
      `Request failed (HTTP ${response.status}).`;
    throw new ApiRequestError(
      typeof message === "string" ? message : "Request failed.",
      response.status,
    );
  }

  if (data === null) {
    throw new ApiRequestError("The server returned an invalid response.", response.status);
  }

  return data;
}

export function apiGet<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  return apiFetch<T>(path, { method: "GET", ...options });
}

export function apiPost<T>(
  path: string,
  body: unknown,
  options?: ApiFetchOptions,
): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options,
  });
}

/**
 * `Alert.alert` is a hard no-op on react-native-web, so every error/success
 * dialog was silently swallowed there. Wrap it in a per-platform fallback.
 */
export function notify(title: string, message?: string): void {
  if (Platform.OS === "web") {
    // react-native-web does not implement Alert; fall back to the DOM.
    if (typeof window !== "undefined" && typeof window.alert === "function") {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    return;
  }

  // Lazy-require to keep react-native-web bundles from evaluating Alert.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Alert } = require("react-native") as typeof import("react-native");
  Alert.alert(title, message);
}