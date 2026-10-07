/**
 * Zod schemas for contact form submissions.
 */

import { z } from "zod";

export const contactBodySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(255),
    email: z.string().trim().email("A valid email is required").max(255),
    subject: z.string().trim().max(255).optional(),
    message: z.string().trim().min(1, "Message is required").max(5000),
  })
  .strip();

export type ContactBody = z.infer<typeof contactBodySchema>;