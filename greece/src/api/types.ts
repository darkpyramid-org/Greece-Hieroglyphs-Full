/**
 * API types and interfaces
 */

import type { ApiError } from "./errors";

export type CustomFetchOptions = RequestInit & {
  responseType?: "json" | "text" | "blob" | "auto";
};

export type ErrorType<T = unknown> = ApiError<T>;

export type BodyType<T> = T;

export type AuthTokenGetter = () => Promise<string | null> | string | null;

export type ResponseType = "json" | "text" | "blob" | "auto";
