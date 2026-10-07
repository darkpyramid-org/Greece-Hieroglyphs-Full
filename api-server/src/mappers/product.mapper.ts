/**
 * Map a DB product row to the public API response shape.
 */

import type { Product } from "../db/schema";
import type { ProductBadge, ProductCategory, ProductResponse } from "../types";
import { PRODUCT_BADGES, PRODUCT_CATEGORIES } from "../types";

const CATEGORY_SET: ReadonlySet<string> = new Set(PRODUCT_CATEGORIES);
const BADGE_SET: ReadonlySet<string> = new Set(PRODUCT_BADGES);

/**
 * Narrow a free-form `varchar` column to a known category.
 *
 * `products.category` is a plain `varchar`, so the database can legitimately hold
 * a value that is not in the catalogue taxonomy. Rather than crash (or silently
 * emit an invalid literal type) we fall back to `Accessories`, which is what the
 * storefront renders as the least specific bucket.
 */
function toCategory(value: string): ProductCategory {
  return CATEGORY_SET.has(value)
    ? (value as ProductCategory)
    : "Accessories";
}

/**
 * Narrow a free-form `varchar` column to a known badge. Unknown values are
 * dropped rather than guessed at.
 */
function toBadge(value: string | null | undefined): ProductBadge | undefined {
  if (!value) return undefined;
  return BADGE_SET.has(value) ? (value as ProductBadge) : undefined;
}

export function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: toCategory(product.category),
    badge: toBadge(product.badge),
    imageUrl: product.imageUrl,
    stock: product.stock,
    slug: product.slug ?? undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function toProductListResponse(products: Product[]): ProductResponse[] {
  return products.map(toProductResponse);
}