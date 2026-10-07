/**
 * Order types
 */

import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
}

export interface Order {
  id: string;
  stripeSessionId?: string | null;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  /** All values are in cents (EGP minor units). */
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderResponse {
  order: Order;
}

export interface CheckoutRequest {
  items: CartItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  customerName: string;
  /**
   * Optional on the wire. The API accepts a partial address and fills in the
   * rest, but the storefront always sends a complete one so the order can be
   * fulfilled and looked up by email.
   */
  shippingAddress?: Partial<ShippingAddress>;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  /** Human-readable order reference, e.g. `OHN-...`. */
  orderId: string;
  /** Order total in cents. */
  total: number;
}

export interface TrackOrderRequest {
  id: string;
  email: string;
}

export interface TrackOrderResponse {
  order: Order;
}
