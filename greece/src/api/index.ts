/**
 * API module exports
 * Main entry point for all API-related functionality
 */

// Generated API client and schemas
export * from "./generated/api";
export * from "./generated/api.schemas";

// Custom fetch implementation
export { customFetch } from "./custom-fetch";

// Configuration
export { setBaseUrl, setAuthTokenGetter, getBaseUrl, getAuthTokenGetter } from "./config";

// Error classes
export { ApiError, ResponseParseError } from "./errors";

// Types
export type {
  CustomFetchOptions,
  ErrorType,
  BodyType,
  AuthTokenGetter,
  ResponseType,
} from "./types";
