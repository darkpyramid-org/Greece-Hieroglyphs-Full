/**
 * Centralized ID generation utilities
 * Eliminates duplicate UUID imports across the codebase
 */

import { randomBytes, randomUUID } from "crypto";

/**
 * Generate a standard UUID v4
 */
export function generateId(): string {
  return randomUUID();
}

/**
 * Generate an order ID with a GREECE prefix (GRC-).
 *
 * Includes a random suffix so IDs cannot be guessed or enumerated. A bare
 * `Date.now()` collided under concurrent checkouts and let anyone walk the
 * `GRC-<timestamp>` sequence to harvest live order IDs for `/api/track-order`.
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `GRC-${timestamp}-${suffix}`;
}

/**
 * Generate product slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate cache-friendly ID
 */
export function generateCacheKey(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map(part => part.toLowerCase().trim())
    .join(':');
}