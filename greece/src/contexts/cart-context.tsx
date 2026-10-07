import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { CartItem, Product } from "@/lib/types";

const CART_STORAGE_KEY = "greece-cart-v2";
const CART_SCHEMA_VERSION = 2;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; product: Product; size?: string }
  | { type: "REMOVE"; productId: string; size?: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number; size?: string }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; items: CartItem[] };

function itemKey(productId: string, size?: string) {
  return `${productId}__${size ?? "default"}`;
}

/** Upper bound on a single line's quantity. Mirrors the API's `MAX_ITEM_QUANTITY`. */
const MAX_ITEM_QUANTITY = 99;

/**
 * Clamp a requested quantity to what is actually purchasable.
 *
 * The `+` control in the cart previously incremented without limit, so a shopper
 * could queue 999 units of a product with `stock: 15`. (The server now
 * re-validates too, but the UI should not offer it.)
 */
function clampQuantity(requested: number, stock: number): number {
  const ceiling = Math.min(
    Number.isFinite(stock) && stock > 0 ? stock : MAX_ITEM_QUANTITY,
    MAX_ITEM_QUANTITY,
  );
  return Math.max(1, Math.min(Math.floor(requested), ceiling));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const key = itemKey(action.product.id, action.size);
      const existing = state.items.find(
        (i) => itemKey(i.product.id, i.size) === key,
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            itemKey(i.product.id, i.size) === key
              ? {
                  ...i,
                  quantity: clampQuantity(
                    i.quantity + 1,
                    i.product.stock,
                  ),
                }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: clampQuantity(1, action.product.stock),
            size: action.size,
          },
        ],
      };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            itemKey(i.product.id, i.size) !==
            itemKey(action.productId, action.size),
        ),
      };
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) =>
              itemKey(i.product.id, i.size) !==
              itemKey(action.productId, action.size),
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i.product.id, i.size) ===
          itemKey(action.productId, action.size)
            ? {
                ...i,
                quantity: clampQuantity(action.quantity, i.product.stock),
              }
            : i,
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface StoredCart {
  v: number;
  items: CartItem[];
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredCart = JSON.parse(raw);
    if (!parsed || parsed.v !== CART_SCHEMA_VERSION) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
    if (!Array.isArray(parsed.items)) return [];
    return parsed.items.filter(
      (i) =>
        i &&
        typeof i === "object" &&
        i.product &&
        typeof i.product.id === "string" &&
        typeof i.quantity === "number" &&
        i.quantity > 0,
    );
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    const payload: StoredCart = { v: CART_SCHEMA_VERSION, items };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const items = loadCart();
    dispatch({ type: "HYDRATE", items });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(state.items);
  }, [state.items, hydrated]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    total,
    addToCart: (product, size) => dispatch({ type: "ADD", product, size }),
    removeFromCart: (productId, size) =>
      dispatch({ type: "REMOVE", productId, size }),
    updateQuantity: (productId, quantity, size) =>
      dispatch({ type: "UPDATE_QTY", productId, quantity, size }),
    clearCart: () => dispatch({ type: "CLEAR" }),
    openCart: () => dispatch({ type: "OPEN" }),
    closeCart: () => dispatch({ type: "CLOSE" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
