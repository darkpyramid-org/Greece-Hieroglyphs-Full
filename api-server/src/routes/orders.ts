import { Router } from "express";
import { asyncHandler, CacheStrategies, rateLimit, validateQuery, validateRequest } from "../middlewares";
import { orderController } from "../controllers";
import { checkoutBodySchema, trackOrderQuerySchema } from "../schemas";

const router = Router();

/**
 * POST /checkout - Create checkout session
 *
 * Validated against `checkoutBodySchema` so an anonymous caller cannot send an
 * unbounded cart, a non-URL redirect target, or a non-numeric quantity.
 * Throttled because each accepted request mints a Stripe Checkout Session.
 * No caching (dynamic, user-specific).
 */
router.post(
  "/checkout",
  rateLimit({ name: "checkout", windowMs: 60_000, max: 10 }),
  validateRequest(checkoutBodySchema),
  CacheStrategies.noCache(),
  asyncHandler(orderController.checkout),
);

/**
 * GET /track-order - Track order by ID and email
 *
 * Cached privately for 60s: the response contains the customer's email, name
 * and full shipping address, so it must never be written to a shared/CDN cache.
 * Throttled to slow down order-id + email enumeration.
 */
router.get(
  "/track-order",
  rateLimit({ name: "track-order", windowMs: 60_000, max: 20 }),
  validateQuery(trackOrderQuerySchema),
  CacheStrategies.private(60),
  asyncHandler(orderController.trackOrder),
);

export default router;