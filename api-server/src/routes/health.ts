import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "../api";
import { asyncHandler } from "../middlewares";

const router: IRouter = Router();

router.get(
  "/healthz",
  asyncHandler(async (_req, res) => {
    const data = HealthCheckResponse.parse({ status: "ok" });
    res.json(data);
  })
);

export default router;