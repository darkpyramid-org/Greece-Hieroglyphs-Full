import { Router } from "express";
import productsRouter from "./products";
import ordersRouter from "./orders";
import contactRouter from "./contact";
import healthRouter from "./health";

const router = Router();

/**
 * Mount route modules
 */
router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/", ordersRouter);
router.use("/contact", contactRouter);

/**
 * Setup endpoint
 */
router.get("/setup", (_req, res) => {
  res.json({ status: "ok", message: "GREECE HIEROGLYPHS API ready. Built with Dark Pyramid." });
});

export default router;
