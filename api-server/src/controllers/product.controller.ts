import type { Request, Response } from "express";
import { productService } from "../services";
import { ensureString } from "../lib/query-helpers";

export const productController = {
  async getAll(_req: Request, res: Response): Promise<void> {
    const products = await productService.getAll();
    res.json({ products });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = ensureString(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }
    const product = await productService.getById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    /**
     * Wrapped in `{ product }` for consistency with every other endpoint
     * (`{ products: [...] }`, `{ order }`). This used to return the bare
     * product, which contradicted both the shared `ProductResponse` type and
     * the storefront's `apiClient.products.getById`.
     */
    res.json({ product });
  },

  async getByCategory(req: Request, res: Response): Promise<void> {
    const category = ensureString(req.params.category);
    if (!category) {
      res.status(400).json({ error: "Category is required" });
      return;
    }
    const products = await productService.getByCategory(category);
    res.json({ products });
  },

  async search(req: Request, res: Response): Promise<void> {
    const query = ensureString(req.params.query);
    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }
    const products = await productService.search(query);
    res.json({ products });
  },
};
