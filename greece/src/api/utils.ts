/**
 * API utility functions
 */

const NO_BODY_STATUS = new Set([204, 205, 304]);

function isRequest(input: RequestInfo | URL): input is Request {
  return typeof Request !== "undefined" && input instanceof Request;
}

function isUrl(input: RequestInfo | URL): input is URL {
  return typeof URL !== "undefined" && input instanceof URL;
}

export function resolveMethod(input: RequestInfo | URL, explicitMethod?: string): string {
  if (explicitMethod) return explicitMethod.toUpperCase();
  if (isRequest(input)) return input.method.toUpperCase();
  return "GET";
}

export function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (isUrl(input)) return input.toString();
  return input.url;
}

export function mergeHeaders(...sources: Array<HeadersInit | undefined>): Headers {
  const headers = new Headers();

  for (const source of sources) {
    if (!source) continue;
    new Headers(source).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

export function getMediaType(headers: Headers): string | null {
  const value = headers.get("content-type");
  return value ? value.split(";", 1)[0].trim().toLowerCase() : null;
}

export function isJsonMediaType(mediaType: string | null): boolean {
  return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}

export function isTextMediaType(mediaType: string | null): boolean {
  return Boolean(
    mediaType &&
      (mediaType.startsWith("text/") ||
        mediaType === "application/xml" ||
        mediaType === "text/xml" ||
        mediaType.endsWith("+xml") ||
        mediaType === "application/x-www-form-urlencoded"),
  );
}

export function hasNoBody(response: Response, method: string): boolean {
  if (method === "HEAD") return true;
  if (NO_BODY_STATUS.has(response.status)) return true;
  if (response.headers.get("content-length") === "0") return true;
  if (response.body === null) return true;
  return false;
}

export function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export function looksLikeJson(text: string): boolean {
  const trimmed = text.trimStart();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

export function inferResponseType(response: Response): "json" | "text" | "blob" {
  const mediaType = getMediaType(response.headers);

  if (isJsonMediaType(mediaType)) return "json";
  if (isTextMediaType(mediaType) || mediaType == null) return "text";
  return "blob";
}

export function applyBaseUrl(input: RequestInfo | URL, baseUrl: string | null): RequestInfo | URL {
  if (!baseUrl) return input;
  const url = resolveUrl(input);
  // Only prepend to relative paths (starting with /)
  if (!url.startsWith("/")) return input;

  const absolute = `${baseUrl}${url}`;
  if (typeof input === "string") return absolute;
  if (isUrl(input)) return new URL(absolute);
  return new Request(absolute, input as Request);
}
