/**
 * Request validation schemas.
 */

export {
  checkoutBodySchema,
  trackOrderQuerySchema,
  orderStatusBodySchema,
  orderStatusSchema,
  shippingAddressSchema,
  cartItemSchema,
  MAX_CHECKOUT_ITEMS,
  MAX_ITEM_QUANTITY,
  type CheckoutBody,
  type TrackOrderQuery,
} from "./order.schema";

export { contactBodySchema, type ContactBody } from "./contact.schema";