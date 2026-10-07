import { Router } from "express";
import { asyncHandler, CacheStrategies, rateLimit, validateRequest } from "../middlewares";
import { contactController } from "../controllers";
import { contactBodySchema } from "../schemas";

const router = Router();

/**
 * POST /contact - Submit contact form
 *
 * Validated + throttled so the endpoint cannot be used to spam the inbox.
 * No caching for contact submissions.
 */
router.post(
  "/",
  rateLimit({ name: "contact", windowMs: 60_000, max: 5 }),
  validateRequest(contactBodySchema),
  CacheStrategies.noCache(),
  asyncHandler(contactController.submit),
);

export default router;