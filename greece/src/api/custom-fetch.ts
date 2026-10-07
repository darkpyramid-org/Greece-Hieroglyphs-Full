/**
 * Custom Fetch - Main HTTP client
 * Uses modular utilities for clean separation of concerns
 */

import type { CustomFetchOptions } from "./types";
import { getBaseUrl, getAuthTokenGetter, getDefaultJsonAccept } from "./config";
import { ApiError } from "./errors";
import { parseErrorBody, parseSuccessBody } from "./parser";
import { resolveMethod, resolveUrl, mergeHeaders, applyBaseUrl, looksLikeJson } from "./utils";

// Re-export configuration functions for convenience
export { setBaseUrl, setAuthTokenGetter } from "./config";
export type { AuthTokenGetter, CustomFetchOptions, ErrorType, BodyType } from "./types";
export { ApiError, ResponseParseError } from "./errors";

/**
 * Custom fetch implementation with enhanced error handling and response parsing
 */
export async function customFetch<T = unknown>(
  input: RequestInfo | URL,
  options: CustomFetchOptions = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const authTokenGetter = getAuthTokenGetter();
  
  input = applyBaseUrl(input, baseUrl);
  const { responseType = "auto", headers: headersInit, ...init } = options;

  const method = resolveMethod(input, init.method);

  if (init.body != null && (method === "GET" || method === "HEAD")) {
    throw new TypeError(`customFetch: ${method} requests cannot have a body.`);
  }

  function isRequest(input: RequestInfo | URL): input is Request {
    return typeof Request !== "undefined" && input instanceof Request;
  }

  const headers = mergeHeaders(isRequest(input) ? input.headers : undefined, headersInit);

  if (
    typeof init.body === "string" &&
    !headers.has("content-type") &&
    looksLikeJson(init.body)
  ) {
    headers.set("content-type", "application/json");
  }

  if (responseType === "json" && !headers.has("accept")) {
    headers.set("accept", getDefaultJsonAccept());
  }

  // Attach bearer token when an auth getter is configured and no
  // Authorization header has been explicitly provided.
  if (authTokenGetter && !headers.has("authorization")) {
    const token = await authTokenGetter();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }

  const requestInfo = { method, url: resolveUrl(input) };

  const response = await fetch(input, { ...init, method, headers });

  if (!response.ok) {
    const errorData = await parseErrorBody(response, method);
    throw new ApiError(response, errorData, requestInfo);
  }

  return (await parseSuccessBody(response, responseType, requestInfo)) as T;
}
