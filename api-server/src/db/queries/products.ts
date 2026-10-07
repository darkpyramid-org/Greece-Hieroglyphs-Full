/**
 * Product queries
 * Data access layer for products
 */

import { db, productsTable } from "../index";
import { eq, like, desc, lte } from "drizzle-orm";
import type { InsertProduct, Product } from "../schema";
import { generateId } from "../../lib/id-generator";

/**
 * Escape `%`, `_` and `\` so a user-supplied search term is matched literally.
 *
 * Without this, `GET /api/products/search/%` returns the entire catalog and
 * `%25`/`_` can be used to probe the table.
 */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export const productQueries = {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    return db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product | undefined> {
    const result = await db.select().from(productsTable).where(eq(productsTable.id, id));
    return result[0];
  },

  /**
   * Get product by slug
   */
  async getBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(productsTable).where(eq(productsTable.slug, slug));
    return result[0];
  },

  /**
   * Get products by category
   */
  async getByCategory(category: string): Promise<Product[]> {
    return db
      .select()
      .from(productsTable)
      .where(eq(productsTable.category, category))
      .orderBy(desc(productsTable.createdAt));
  },

  /**
   * Search products by name
   */
  async search(query: string): Promise<Product[]> {
    return db
      .select()
      .from(productsTable)
      .where(like(productsTable.name, `%${escapeLikePattern(query)}%`))
      .orderBy(desc(productsTable.createdAt));
  },

  /**
   * Create product
   */
  async create(data: InsertProduct): Promise<Product> {
    const result = await db.insert(productsTable).values({
      id: generateId(),
      ...data,
    }).returning();
    return result[0];
  },

  /**
   * Update product
   */
  async update(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db
      .update(productsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();
    return result[0];
  },

  /**
   * Delete product
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(productsTable).where(eq(productsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  },

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number): Promise<Product | undefined> {
    const product = await this.getById(id);
    if (!product) return undefined;

    const newStock = Math.max(0, product.stock - quantity);
    return this.update(id, { stock: newStock });
  },

  /**
   * Get low stock products (stock at or below the threshold)
   */
  async getLowStock(threshold: number = 10): Promise<Product[]> {
    return db
      .select()
      .from(productsTable)
      .where(lte(productsTable.stock, threshold))
      .orderBy(desc(productsTable.createdAt));
  },
};
