import type { Request, Response } from "express";
import { contactService } from "../services";
import type { ContactBody } from "../schemas";

export const contactController = {
  /**
   * `req.body` has already been validated by `validateRequest`
   * (`contactBodySchema`).
   */
  async submit(req: Request, res: Response): Promise<void> {
    const result = await contactService.submit(req.body as ContactBody);

    res.json(result);
  },
};