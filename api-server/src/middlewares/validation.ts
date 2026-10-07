/**
 * Request validation middleware
 * Validates incoming requests against Zod schemas
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "./error-handler";

/** Key under which validated query params are published on the request. */
export const VALIDATED_QUERY = "validatedQuery";

/** Flatten a ZodError into a `{ field: message }` map for the API error body. */
function toFieldErrors(error: ZodError): Record<string, string> {
  const details: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_";
    // Keep the first message per field; it is the most specific one.
    if (!(path in details)) details[path] = issue.message;
  }

  return details;
}

function validationError(
  message: string,
  error: unknown,
): ApiError {
  const apiError: ApiError = new Error(message);
  apiError.statusCode = 400;

  if (error instanceof ZodError) {
    apiError.details = toFieldErrors(error);
  } else if (error instanceof Error) {
    apiError.details = { _: error.message };
  }

  return apiError;
}

/**
 * Validate and replace `req.body`.
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: unknown) {
      next(validationError("Validation failed", error));
    }
  };
};

/**
 * Validate `req.query`.
 *
 * The parsed result is published as `req.validatedQuery` rather than assigned
 * back onto `req.query`: Express 5 exposes `query` as a getter-only property, so
 * writing to it throws `TypeError: Cannot set property query ... which has only
 * a getter`.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query) as Record<string, unknown>;
      Object.defineProperty(req, VALIDATED_QUERY, {
        value: parsed,
        writable: true,
        configurable: true,
        enumerable: false,
      });
      next();
    } catch (error: unknown) {
      next(validationError("Query validation failed", error));
    }
  };
};