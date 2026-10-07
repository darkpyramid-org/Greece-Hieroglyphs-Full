/**
 * Zod schemas for order / checkout requests.
 *
 * These are deliberately *tight*: the checkout body arrives straight from the
 * browser, so every field that influences money (price, total) must be treated
 * as untrusted. Prices are re-resolved from the database in `order.service`;
 * anything sent here is only used as a lookup hint.
 */

import { z } from "zod";

/** Hard cap on how many line items a single checkout may contain. */
export const MAX_CHECKOUT_ITEMS = 50;

/** Hard cap on the quantity of a single line item. */
export const MAX_ITEM_QUANTITY = 99;

const productRefSchema = z
  .object({
    id: z.string().trim().min(1, "Product id is required").max(64),
    /**
     * Accepted so we can log/compare what the client believed, but the service
     * ignores it — the authoritative price always comes from the database.
     */
    price: z.number().int().nonnegative().optional(),
    name: z.string().max(200).optional(),
  })
  .strip();

export const cartItemSchema = z.object({
  product: productRefSchema,
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(MAX_ITEM_QUANTITY, `Quantity cannot exceed ${MAX_ITEM_QUANTITY}`),
  size: z.string().trim().max(32).optional(),
  color: z.string().trim().max(64).optional(),
});

/**
 * Shipping address. Optional so older clients (and the Expo app before the
 * pre-checkout form) still work; the service substitutes a normalised
 * placeholder when it is absent so persistence never fails on a NOT NULL column.
 */
export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(1).max(255).optional(),
  email: z.string().trim().email("Invalid shipping email").max(255).optional(),
  phone: z.string().trim().max(32).optional(),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(120).optional(),
  governorate: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(32).optional(),
  country: z.string().trim().max(64).optional(),
});

export const checkoutBodySchema = z
  .object({
    items: z
      .array(cartItemSchema)
      .min(1, "Cart is empty")
      .max(MAX_CHECKOUT_ITEMS, `A checkout cannot contain more than ${MAX_CHECKOUT_ITEMS} items`),
    successUrl: z.string().trim().url("successUrl must be a valid URL").max(2048),
    cancelUrl: z.string().trim().url("cancelUrl must be a valid URL").max(2048),
    customerEmail: z.string().trim().email("A valid customer email is required").max(255),
    customerName: z.string().trim().min(1, "Customer name is required").max(255),
    shippingAddress: shippingAddressSchema.optional(),
    paymentMethod: z.enum(["stripe", "cash_on_delivery", "bank_transfer"]).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .strip();

export type CheckoutBody = z.infer<typeof checkoutBodySchema>;

export const trackOrderQuerySchema = z.object({
  id: z.string().trim().min(1, "Order ID is required").max(128),
  email: z.string().trim().email("A valid email is required").max(255),
});

export type TrackOrderQuery = z.infer<typeof trackOrderQuerySchema>;

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const orderStatusBodySchema = z.object({
  status: orderStatusSchema,
});