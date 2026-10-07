/**
 * Order queries
 * Data access layer for orders
 */

import { db, ordersTable } from "../index";
import { eq, desc } from "drizzle-orm";
import type { InsertOrder, Order } from "../schema";
import { generateId } from "../../lib/id-generator";

export const orderQueries = {
  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    return db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  },

  /**
   * Get order by ID
   */
  async getById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    return result[0];
  },

  /**
   * Get orders by customer email
   */
  async getByCustomerEmail(email: string): Promise<Order[]> {
    return db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.customerEmail, email))
      .orderBy(desc(ordersTable.createdAt));
  },

  /**
   * Get order by Stripe session ID
   */
  async getByStripeSessionId(sessionId: string): Promise<Order | undefined> {
    const result = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.stripeSessionId, sessionId));
    return result[0];
  },

  /**
   * Create order
   */
  async create(data: InsertOrder): Promise<Order> {
    const result = await db.insert(ordersTable).values({
      /**
       * Honour a caller-supplied id (e.g. the human-readable `OHN-…` id that
       * the customer is shown). Previously every row got a random UUID, so the
       * order id handed back by the checkout endpoint could never be used to
       * track the order it referred to.
       */
      id: data.id || generateId(),
      shippingAddress: data.shippingAddress,
      items: data.items,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      total: data.total,
      status: data.status || "pending",
      stripeSessionId: data.stripeSessionId || null,
    }).returning();
    return result[0];
  },

  /**
   * Update order
   */
  async update(id: string, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db
      .update(ordersTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    return result[0];
  },

  /**
   * Update order status
   */
  async updateStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning();
    return result[0];
  },

  /**
   * Delete order
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(ordersTable).where(eq(ordersTable.id, id));
    return (result.rowCount ?? 0) > 0;
  },

  /**
   * Get orders by status
   */
  async getByStatus(status: string): Promise<Order[]> {
    return db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.status, status))
      .orderBy(desc(ordersTable.createdAt));
  },

  /**
   * Get pending orders
   */
  async getPending(): Promise<Order[]> {
    return this.getByStatus("pending");
  },

  /**
   * Get paid orders
   */
  async getPaid(): Promise<Order[]> {
    return this.getByStatus("paid");
  },

  /**
   * Get shipped orders
   */
  async getShipped(): Promise<Order[]> {
    return this.getByStatus("shipped");
  },

  /**
   * Get delivered orders
   */
  async getDelivered(): Promise<Order[]> {
    return this.getByStatus("delivered");
  },
};
