/**
 * Orders table schema
 */

import {
  pgTable,
  integer,
  varchar,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ordersTable = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  shippingAddress: json("shipping_address").notNull(),
  items: json("items").notNull(), // Array of CartItem
  total: integer("total").notNull(), // Total in EGP (stored as cents)
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, paid, shipped, delivered
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Create insert schema and omit auto-generated fields
export const insertOrderSchema = z.object({
  id: z.string().min(1).max(64).optional(),
  customerEmail: z.string().email("Invalid email"),
  customerName: z.string().min(1, "Customer name is required"),
  shippingAddress: z.unknown(), // Required
  items: z.unknown(), // Required
  total: z.number().int().positive("Total must be positive"),
  status: z.string().optional(),
  stripeSessionId: z.string().optional().nullable(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
