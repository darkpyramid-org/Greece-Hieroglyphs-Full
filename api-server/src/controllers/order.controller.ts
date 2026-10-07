import type { Request, Response } from "express";
import { orderService } from "../services";
import type { TrackOrderQuery } from "../schemas";

export const orderController = {
  /**
   * `req.body` has already been parsed and validated by `validateRequest`
   * (`checkoutBodySchema`), so the validated payload can be forwarded as-is.
   */
  async checkout(req: Request, res: Response): Promise<void> {
    const result = await orderService.createCheckout(req.body);
    res.json(result);
  },

  async trackOrder(req: Request, res: Response): Promise<void> {
    // Populated by `validateQuery(trackOrderQuerySchema)`; `req.query` itself is
    // read-only in Express 5.
    const { id, email } = (req as Request & { validatedQuery: TrackOrderQuery })
      .validatedQuery;

    const order = await orderService.trackOrder(id, email);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ order });
  },
};