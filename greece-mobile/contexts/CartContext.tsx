import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CartItem, Product } from "@/constants/products";

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "greece-cart-mobile";

/** Hard cap on a single cart line's quantity. */
const MAX_QUANTITY = 99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /**
   * Rehydrate from AsyncStorage once, and only AFTER it settles do we let
   * `items` be persisted again. Previously a `setItems([])`-from-storage
   * callback could land after the user's first tap and silently wipe it.
   */
  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) {
          try {
            const parsed: unknown = JSON.parse(raw);
            // Validate the shape — a corrupt payload used to crash the provider
            // when callers did `items.reduce` on it.
            if (Array.isArray(parsed)) {
              const valid = parsed.filter(
                (i): i is CartItem =>
                  !!i &&
                  typeof i === "object" &&
                  typeof i.product === "object" &&
                  typeof i.product?.id === "string" &&
                  typeof i.quantity === "number" &&
                  i.quantity > 0,
              );
              setItems(valid);
            }
          } catch {
            // Corrupt JSON — start empty rather than crash.
          }
        }
      })
      .catch(() => {
        // Storage unavailable (e.g. web private mode) — keep the in-memory cart.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist only after hydration completes, and never write an empty cart over
  // a stored one during startup.
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, hydrated]);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const addItem = useCallback((product: Product, size: string, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      let next: CartItem[];
      if (idx >= 0) {
        next = prev.map((item, i) =>
          i === idx
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || MAX_QUANTITY) }
            : item
        );
      } else {
        next = [...prev, { product, size, quantity: Math.min(quantity, product.stock || quantity) }];
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.product.id === productId && i.size === size))
        : prev.map((i) =>
            i.product.id === productId && i.size === size
              ? { ...i, quantity: Math.min(quantity, i.product.stock || quantity) }
              : i
          )
    );
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, hydrated, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}