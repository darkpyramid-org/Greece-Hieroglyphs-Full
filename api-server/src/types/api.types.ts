/**
 * API-specific type definitions
 * HTTP request/response types, middleware types, etc.
 */

import type { Request, Response } from 'express';

/**
 * Extended Express Request with typed body
 *
 * `body`, `query` and `params` are narrowed via `Omit` because Express pins them
 * to `any`/`ParamsDictionary`/`ParsedQs`. Extending `Request` directly makes the
 * redeclared members incompatible (TS2430).
 */
export type TypedRequest<TBody = unknown> = Omit<Request, "body"> & {
  body: TBody;
};

/**
 * Extended Express Request with typed query
 */
export type TypedRequestQuery<TQuery = unknown> = Omit<Request, "query"> & {
  query: TQuery;
};

/**
 * Extended Express Request with typed params
 */
export type TypedRequestParams<TParams = unknown> = Omit<Request, "params"> & {
  params: TParams;
};

/**
 * Full typed request
 */
export type TypedRequestFull<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = Omit<Request, "body" | "query" | "params"> & {
  body: TBody;
  query: TQuery;
  params: TParams;
};

/**
 * API Error structure
 */
export interface ApiError extends Error {
  statusCode?: number;
  details?: Record<string, any>;
  code?: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
  uptime: number;
  version?: string;
  environment?: string;
  services?: {
    database: 'connected' | 'disconnected';
    cache: 'active' | 'inactive';
    stripe: 'configured' | 'not_configured';
  };
}

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Cache metadata
 */
export interface CacheMetadata {
  key: string;
  ttl: number;
  createdAt: number;
  expiresAt: number;
  hitCount?: number;
}

/**
 * Request context (for logging/tracing)
 */
export interface RequestContext {
  requestId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip: string;
  startTime: number;
}

/**
 * Middleware options
 */
export interface MiddlewareOptions {
  enabled?: boolean;
  skipPaths?: string[];
  onlyPaths?: string[];
}

/**
 * CORS options
 */
export interface CorsOptions extends MiddlewareOptions {
  origins?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Rate limiting options
 */
export interface RateLimitOptions extends MiddlewareOptions {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

/**
 * Logging options
 */
export interface LoggingOptions extends MiddlewareOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  includeBody?: boolean;
  includeQuery?: boolean;
  includeHeaders?: boolean;
  sensitiveFields?: string[];
}