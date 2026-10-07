/**
 * Order-related type definitions
 */

import type { BaseEntity } from './shared.types';
import type { ProductResponse } from './product.types';

/**
 * Order status enum
 */
export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing'
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'
  | 'refunded';

/**
 * Payment method types
 */
export type PaymentMethod = 'stripe' | 'cash_on_delivery' | 'bank_transfer';

/**
 * Shipping address structure
 */
export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
  country?: string;
}

/**
 * Cart item structure as stored and returned by the API.
 *
 * `unitPrice` / `totalPrice` are always derived from the catalog by the server.
 */
export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number; // in cents
    description?: string;
    imageUrl?: string;
  };
  quantity: number;
  size?: string;
  color?: string;
  unitPrice: number; // in cents
  totalPrice: number; // in cents
}

/**
 * Cart item as submitted by a client.
 *
 * Only the product reference and the quantity are honoured. Price fields sent
 * by the client are ignored: `order.service` re-resolves every line against the
 * database, so a tampered `price` cannot change what the customer is charged.
 */
export interface CartItemInput {
  product: {
    id: string;
    price?: number; // in cents — ignored, used only in demo mode
    name?: string; // ignored, used only in demo mode
    description?: string;
    imageUrl?: string;
  };
  quantity: number;
  size?: string;
  color?: string;
}

/**
 * Order details structure
 */
export interface OrderDetails extends BaseEntity {
  stripeSessionId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number; // in cents
  shippingCost: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  notes?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
}

/**
 * Checkout request
 */
export interface CheckoutRequest {
  items: CartItemInput[];
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  customerName: string;
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

/**
 * Checkout response
 */
export interface CheckoutResponse {
  url: string;
  sessionId: string;
  orderId: string;
  total: number;
  estimatedDelivery?: Date;
}

/**
 * Track order request
 */
export interface TrackOrderRequest {
  id: string;
  email: string;
}

/**
 * Track order response
 */
export interface TrackOrderResponse {
  order: OrderDetails;
}

/**
 * Order summary for lists
 */
export interface OrderSummary {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
  createdAt: Date;
  estimatedDelivery?: Date;
}

/**
 * Order filters for admin
 */
export interface OrderFilters {
  status?: OrderStatus[];
  paymentMethod?: PaymentMethod[];
  dateFrom?: Date;
  dateTo?: Date;
  customerEmail?: string;
  minTotal?: number;
  maxTotal?: number;
}

/**
 * Order statistics
 */
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}