import type { Product } from "@/types";

/**
 * Fallback product data - used when API is unavailable
 * This matches the backend seed data exactly
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "HORUS HOODIE",
    description: "Oversized hoodie with the Eye of Horus embroidered across the chest. Premium 400gsm cotton blend. Ancient power meets street comfort.",
    price: 349900,
    category: "Hoodies",
    badge: "BESTSELLER",
    imageUrl: "/HORUS-HOODIE.jpg",
    stock: 50,
    slug: "horus-hoodie",
  },
  {
    id: "2",
    name: "ANKH TEE",
    description: "Relaxed fit tee with oversized Ankh symbol. Heavyweight 220gsm cotton. The symbol of eternal life on your chest.",
    price: 129900,
    category: "T-Shirts",
    badge: "LIMITED",
    imageUrl: "/ANKH-TEE.jpg",
    stock: 30,
    slug: "ankh-tee",
  },
  {
    id: "3",
    name: "PHARAOH JACKET",
    description: "Bomber jacket with scarab beetle and pyramid patterns. Premium polyester with Egyptian motifs. Rule the streets like a pharaoh.",
    price: 549900,
    category: "Jackets",
    badge: "NEW",
    imageUrl: "/PHARAOH-JACKET.jpg",
    stock: 20,
    slug: "pharaoh-jacket",
  },
  {
    id: "4",
    name: "NILE JOGGERS",
    description: "Streetwear joggers with Egyptian wave patterns along the sides. 300gsm fleece. Comfort from the banks of the Nile.",
    price: 219900,
    category: "Bottoms",
    badge: "TRENDING",
    imageUrl: "/NILE-JOGGER.png",
    stock: 45,
    slug: "nile-joggers",
  },
  {
    id: "5",
    name: "CLEOPATRA CAP",
    description: "Structured 6-panel cap with embroidered Cleopatra profile. Premium cotton twill. Royalty on your head.",
    price: 79900,
    category: "Accessories",
    badge: "EXCLUSIVE",
    imageUrl: "/CLEOPATRA-CAP.jpg",
    stock: 100,
    slug: "cleopatra-cap",
  },
  {
    id: "6",
    name: "SPHINX SWEATPANTS",
    description: "Tapered sweatpants with Sphinx embroidery on the thigh. 280gsm French terry. Comfort meets mythology.",
    price: 189900,
    category: "Bottoms",
    badge: "UTILITY",
    imageUrl: "/SPHINX-SWEATPANTS.jpg",
    stock: 35,
    slug: "sphinx-sweatpants",
  },
  {
    id: "7",
    name: "PYRAMID OVERSIZED TEE",
    description: "Ultra-oversized tee with geometric pyramid print. 200gsm heavyweight cotton. Architectural streetwear.",
    price: 149900,
    category: "T-Shirts",
    badge: "NEW",
    imageUrl: "/PYRAMID-OVERSIZED-TEE.jpg",
    stock: 60,
    slug: "pyramid-oversized-tee",
  },
  {
    id: "8",
    name: "CARTOUCHE LONG SLEEVE",
    description: "Long sleeve tee with cartouche design wrapping around the sleeve. 220gsm cotton. Ancient script, modern style.",
    price: 169900,
    category: "T-Shirts",
    badge: "BESTSELLER",
    imageUrl: "/CARTOUCHE-LONG-SLEEVE.jpg",
    stock: 55,
    slug: "cartouche-long-sleeve",
  },
  {
    id: "9",
    name: "SCARAB BOMBER",
    description: "Lightweight bomber with scarab beetle embroidery. Nylon shell with cotton lining. Insect-inspired streetwear.",
    price: 399900,
    category: "Jackets",
    badge: "LIMITED",
    imageUrl: "/SCARAB-BOMBER.jpg",
    stock: 25,
    slug: "scarab-bomber",
  },
  {
    id: "10",
    name: "HIEROGLYPH HOODIE",
    description: "Pullover hoodie with all-over hieroglyph print. 350gsm cotton blend. Wear ancient language.",
    price: 329900,
    category: "Hoodies",
    badge: "TRENDING",
    imageUrl: "/HIEROGLYPH-HOODIE.jpg",
    stock: 40,
    slug: "hieroglyph-hoodie",
  },
  {
    id: "11",
    name: "NEFERTITI CROP TOP",
    description: "Fitted crop top with Nefertiti profile. 180gsm cotton. Celebrate the queen of beauty.",
    price: 99900,
    category: "T-Shirts",
    badge: "EXCLUSIVE",
    imageUrl: "/NEFERTITI-CROP-TOP.jpg",
    stock: 50,
    slug: "nefertiti-crop-top",
  },
  {
    id: "12",
    name: "ANKH CHAIN NECKLACE",
    description: "Stainless steel Ankh pendant on chain. Adjustable length. Timeless symbol of life.",
    price: 49900,
    category: "Accessories",
    badge: "NEW",
    imageUrl: "/ANKH-CHAIN-NECKLACE.jpg",
    stock: 200,
    slug: "ankh-chain-necklace",
  },
];

// Keep PRODUCTS for backward compatibility - will be populated from API
export let PRODUCTS: Product[] = FALLBACK_PRODUCTS;

export const CATEGORIES = ["All", "Hoodies", "T-Shirts", "Jackets", "Bottoms", "Accessories"];

/**
 * Format price in EGP (price is stored in cents)
 */
export function fmt(price: number): string {
  const egp = price / 100;
  return `EGP ${egp.toLocaleString("en-EG")}`;
}

/**
 * Free-shipping threshold, in the same minor units as `Product.price`.
 *
 * These constants used to be declared locally in both `pages/cart.tsx` and
 * `components/cart/cart-drawer.tsx` as bare `1500` / `60`, i.e. major units,
 * while every price in the app is in cents. Because the cheapest item costs
 * 49,900 cents, `total >= 1500` was always true: every order shipped free and
 * the "add X more for free shipping" banner could never render.
 *
 * Must stay in sync with `FREE_SHIPPING_THRESHOLD` / `STANDARD_SHIPPING_FEE` in
 * `api-server/src/services/order.service.ts`, which is authoritative.
 */
export const FREE_SHIPPING_THRESHOLD_CENTS = 150_000; // EGP 1,500
export const SHIPPING_FEE_CENTS = 6_000; // EGP 60

/** Shipping fee for a given subtotal (both in cents). */
export function shippingFeeFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
}

/** How much more is needed to qualify for free shipping (cents, floored at 0). */
export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

/**
 * Get product by ID or slug
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

/**
 * Update products from API
 */
export function setProducts(products: Product[]): void {
  PRODUCTS = products;
}

export const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: "bg-[#C89D29] text-[#1B1B1B]",
  LIMITED:    "bg-[#AE1C1C] text-white",
  NEW:        "bg-[#1D4D4F] text-white",
  TRENDING:   "bg-[#213D9A] text-white",
  EXCLUSIVE:  "bg-[#4B0082] text-white",
  UTILITY:    "bg-[#1B1B1B] text-[#FDF8EF]",
};
