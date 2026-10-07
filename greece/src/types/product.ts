/**
 * Product types
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in cents (EGP)
  category: string;
  badge?: string | null;
  imageUrl: string;
  stock: number;
  slug?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}
