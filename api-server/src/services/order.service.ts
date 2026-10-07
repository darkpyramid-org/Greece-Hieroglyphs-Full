/**
 * Order service.
 *
 * Security-critical: this module is the only place that decides how much money
 * a customer is charged. Client-supplied prices are treated as untrusted hints,
 * never as the authority — see `resolvePricedItems`.
 */

import { orderQueries, productQueries } from "../db/queries";
import { toOrderResponse } from "../mappers";
import { inMemoryOrders } from "../lib/in-memory-store";
import { generateOrderId } from "../lib/id-generator";
import { validateEmail, normalizeName } from "../lib/string-utils";
import { assertAllowedRedirect } from "../lib/url-guard";
import { cache, CacheKeys, CacheTTL } from "../lib/cache";
import { env } from "../lib/env";
import { logger } from "../lib/logger";
import type {
  CartItem,
  CheckoutResponse,
  OrderDetails,
  ShippingAddress,
} from "../types";
import type { CheckoutBody } from "../schemas";

/** Free standard shipping above this subtotal (minor units / piastres). */
const FREE_SHIPPING_THRESHOLD = 150_000; // EGP 1,500
/** Flat standard shipping fee below the threshold (minor units / piastres). */
const STANDARD_SHIPPING_FEE = 6_000; // EGP 60

function badRequest(message: string): Error {
  return Object.assign(new Error(message), { statusCode: 400 });
}

function serviceUnavailable(message: string): Error {
  return Object.assign(new Error(message), { statusCode: 503 });
}

/**
 * Fill in a complete, persisted shipping address.
 *
 * `shipping_address` is a NOT NULL column, and older clients (the Expo app
 * before its pre-checkout form) still omit the field entirely, so a normalised
 * placeholder is substituted rather than failing the insert.
 */
function normaliseShippingAddress(
  address: CheckoutBody["shippingAddress"],
  customerEmail: string,
  customerName: string,
): ShippingAddress {
  return {
    fullName: address?.fullName?.trim() || customerName,
    email: address?.email?.trim().toLowerCase() || customerEmail,
    phone: address?.phone?.trim() ?? "",
    address: address?.address?.trim() ?? "",
    city: address?.city?.trim() ?? "",
    governorate: address?.governorate?.trim() ?? "",
    postalCode: address?.postalCode?.trim() ?? "",
    ...(address?.country?.trim() ? { country: address.country.trim() } : {}),
  };
}

/**
 * Rebuild cart items using authoritative catalog data.
 *
 * For every requested line we look the product up by id and then by slug and
 * take the price, name and image from the database. This closes the price
 * tampering hole where a client could POST `price: 1` and have it charged.
 */
async function resolvePricedItems(
  requested: CheckoutBody["items"],
): Promise<CartItem[]> {
  const resolved: CartItem[] = [];

  for (const item of requested) {
    const lookupId = item.product.id.trim();

    let catalogProduct = await productQueries.getById(lookupId);
    if (!catalogProduct) catalogProduct = await productQueries.getBySlug(lookupId);

    if (!catalogProduct) {
      if (!env.allowUnverifiedPrices) {
        throw badRequest(`Unknown product: ${lookupId}`);
      }

      // Demo mode (no database attached): fall back to the client-supplied price
      // so the storefront can still be walked through end to end.
      logger.warn({ lookupId }, "Catalog lookup failed; trusting client price (ALLOW_UNVERIFIED_PRICES)");
      resolved.push({
        product: {
          id: lookupId,
          name: item.product.name?.trim() || lookupId,
          price: item.product.price ?? 0,
          ...(item.product.name ? { description: item.product.name } : {}),
        },
        quantity: item.quantity,
        ...(item.size ? { size: item.size } : {}),
        ...(item.color ? { color: item.color } : {}),
        unitPrice: item.product.price ?? 0,
        totalPrice: (item.product.price ?? 0) * item.quantity,
      });
      continue;
    }

    const unitPrice = catalogProduct.price;

    if (unitPrice <= 0) {
      throw badRequest(`Product is not purchasable: ${catalogProduct.name}`);
    }
    if (catalogProduct.stock < item.quantity) {
      throw badRequest(
        `Only ${catalogProduct.stock} left of ${catalogProduct.name}`,
      );
    }

    resolved.push({
      product: {
        id: catalogProduct.id,
        name: catalogProduct.name,
        price: unitPrice,
        description: catalogProduct.description.slice(0, 200),
        imageUrl: catalogProduct.imageUrl,
      },
      quantity: item.quantity,
      ...(item.size ? { size: item.size } : {}),
      ...(item.color ? { color: item.color } : {}),
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    });
  }

  return resolved;
}

function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export const orderService = {
  /**
   * `data` is the output of `checkoutBodySchema` (see `validateRequest`), so it
   * is already shape-checked; the remaining work is normalisation plus the
   * security-sensitive steps: re-pricing against the catalog and validating the
   * redirect targets.
   */
  async createCheckout(body: CheckoutBody): Promise<CheckoutResponse> {
    // Validate and normalize input data
    const normalizedEmail = validateEmail(body.customerEmail);
    const normalizedName = normalizeName(body.customerName);
    const shippingAddress = normaliseShippingAddress(
      body.shippingAddress,
      normalizedEmail,
      normalizedName,
    );

    // Never hand an arbitrary URL to Stripe — that is an open redirect.
    const successUrl = assertAllowedRedirect(body.successUrl, "successUrl");
    const cancelUrl = assertAllowedRedirect(body.cancelUrl, "cancelUrl");

    // Re-price every line against the authoritative catalog.
    let items: CartItem[];
    try {
      items = await resolvePricedItems(body.items);
    } catch (err) {
      // Deliberate 4xx (unknown product, out of stock) propagates untouched; a
      // dead database must not be reported to the customer as a bad request.
      if (isClientError(err)) throw err;
      logger.error({ err }, "Catalog lookup failed during checkout");
      throw serviceUnavailable(
        "Our catalog is temporarily unavailable. Please try again shortly.",
      );
    }

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shippingCost = calculateShipping(subtotal);
    const total = subtotal + shippingCost;
    const orderId = generateOrderId();

    const stripeKey = env.stripeSecretKey;
    const stripeConfigured = !!stripeKey && stripeKey.startsWith("sk_");

    let sessionId: string;
    let checkoutUrl: string;

    if (stripeConfigured) {
      let session;

      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey as string);

        const lineItems = items.map((item) => ({
          price_data: {
            currency: "egp",
            product_data: {
              name: item.product.name,
              ...(item.product.description
                ? { description: item.product.description }
                : {}),
            },
            unit_amount: item.unitPrice,
          },
          quantity: item.quantity,
        }));

        // Fold the flat shipping fee into the session as its own line item so
        // the amount the customer pays always matches `total`.
        if (shippingCost > 0) {
          lineItems.push({
            price_data: {
              currency: "egp",
              product_data: { name: "Standard shipping" },
              unit_amount: shippingCost,
          },
            quantity: 1,
          });
        }

        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: { source: "greece", orderId },
        });
      } catch (err) {
        /**
         * Previously this fell through to a mock checkout URL, so a real Stripe
         * outage silently produced an "order" that was never paid for. Surface a
         * retryable error instead.
         */
        logger.error({ err }, "Stripe checkout session creation failed");
        throw Object.assign(
          new Error("Payment provider is unavailable. Please try again."),
          { statusCode: 502 },
        );
      }

      if (!session.url) {
        logger.error({ sessionId: session.id }, "Stripe session returned no URL");
        throw Object.assign(
          new Error("Payment provider is unavailable. Please try again."),
          { statusCode: 502 },
        );
      }

      sessionId = session.id;
      checkoutUrl = session.url;
    } else {
      // No Stripe key configured (local/demo): simulate the redirect.
      sessionId = `mock_${orderId}`;
      checkoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", sessionId);
    }

    /**
     * Only the session id is appended. The order total used to be embedded in
     * the redirect query string, which leaked it into browser history, server
     * logs, and the `Referer` header of every outbound request.
     */
    const url = checkoutUrl;

    try {
      await orderQueries.create({
        id: orderId,
        stripeSessionId: sessionId,
        customerEmail: normalizedEmail,
        customerName: normalizedName,
        shippingAddress,
        items,
        total,
        status: "pending",
      });

      // Invalidate order cache for this email
      cache.invalidatePattern(`orders:email:${normalizedEmail}`);
    } catch (err) {
      logger.warn({ err }, "Database unavailable, storing order in memory");
      inMemoryOrders.push({
        id: orderId,
        stripeSessionId: sessionId,
        customerEmail: normalizedEmail,
        customerName: normalizedName,
        shippingAddress,
        items,
        total,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { url, sessionId, orderId, total };
  },

  async trackOrder(orderId: string, email: string): Promise<OrderDetails | null> {
    const normalizedEmail = validateEmail(email);
    const normalisedOrderId = orderId.trim();
    const cacheKey = `${CacheKeys.orders.byId(normalisedOrderId)}:${normalizedEmail}`;

    // Try cache first
    const cached = cache.get<OrderDetails>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Optimized: Try direct lookup by ID first
      let order = await orderQueries.getById(normalisedOrderId);

      // If not found by ID, try by Stripe session ID
      if (!order) {
        order = await orderQueries.getByStripeSessionId(normalisedOrderId);
      }

      // Verify email matches
      if (order && order.customerEmail.toLowerCase() === normalizedEmail) {
        const result = toOrderResponse(order);
        cache.set(cacheKey, result, CacheTTL.orders);
        return result;
      }
    } catch (err) {
      logger.warn({ err }, "Database unavailable, checking in-memory orders");
    }

    // Fallback to in-memory orders
    const memOrder = inMemoryOrders.find(
      (o) =>
        (o.id === normalisedOrderId || o.stripeSessionId === normalisedOrderId) &&
        o.customerEmail.toLowerCase() === normalizedEmail,
    );

    if (memOrder) {
      const result = toOrderResponse(memOrder);
      cache.set(cacheKey, result, CacheTTL.orders);
      return result;
    }

    return null;
  },

  /**
   * Invalidate order cache (call after order updates)
   */
  invalidateCache(orderId?: string, email?: string): void {
    if (orderId) {
      cache.invalidatePattern(`orders:id:${orderId}`);
    }
    if (email) {
      cache.invalidatePattern(`orders:email:${email.toLowerCase()}`);
    }
  },
};

/**
 * True when an error was raised deliberately for a bad client request, i.e. it
 * already carries a 4xx `statusCode`. Everything else is treated as an
 * infrastructure failure.
 */
function isClientError(err: unknown): boolean {
  const statusCode = (err as { statusCode?: number } | null)?.statusCode;
  return typeof statusCode === "number" && statusCode >= 400 && statusCode < 500;
}