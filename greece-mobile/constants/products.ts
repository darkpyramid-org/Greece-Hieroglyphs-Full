export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  badge: string;
  image_url: string;
  stock: number;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "HORUS HOODIE",
    description: "Oversized hoodie with the Eye of Horus embroidered across the chest. Premium 400gsm cotton blend. Ancient power meets street comfort.",
    price: 349900,
    category: "Hoodies",
    badge: "BESTSELLER",
    image_url: "/streetwear-egyptian-sketch.png",
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
    image_url: "/abstract-geometric-shapes.png",
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
    image_url: "/egyptian-streetwear-timeline.png",
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
    image_url: "/streetwear-egyptian-sketch.png",
    stock: 45,
    slug: "nile-joggers",
  },
  {
    id: "5",
    name: "CLEOPATRA CAP",
    description: "Snapback cap with golden Egyptian crown embroidery. One size fits all. Channel the power of the most iconic ruler.",
    price: 89900,
    category: "Accessories",
    badge: "EXCLUSIVE",
    image_url: "/abstract-geometric-shapes.png",
    stock: 60,
    slug: "cleopatra-cap",
  },
  {
    id: "6",
    name: "OSIRIS BACKPACK",
    description: "Urban backpack with Egyptian god motifs and hieroglyphic straps. 25L capacity. Built for the modern pharaoh on the move.",
    price: 299900,
    category: "Accessories",
    badge: "UTILITY",
    image_url: "/egyptian-streetwear-timeline.png",
    stock: 25,
    slug: "osiris-backpack",
  },
  {
    id: "7",
    name: "RA SWEATER",
    description: "Crew neck sweater with Ra sun disc on the back. 350gsm cotton blend. Carry the power of the sun god.",
    price: 279900,
    category: "Hoodies",
    badge: "NEW",
    image_url: "/streetwear-egyptian-sketch.png",
    stock: 35,
    slug: "ra-sweater",
  },
  {
    id: "8",
    name: "SPHINX TEE",
    description: "Graphic tee with the Sphinx illustration in minimal line art. Lightweight 180gsm. A guardian of ancient mysteries.",
    price: 149900,
    category: "T-Shirts",
    badge: "TRENDING",
    image_url: "/abstract-geometric-shapes.png",
    stock: 55,
    slug: "sphinx-tee",
  },
  {
    id: "9",
    name: "HIEROGLYPH BOMBER",
    description: "Premium bomber jacket with allover hieroglyph print. Satin finish with quilted lining. A wearable tablet of ancient history.",
    price: 499900,
    category: "Jackets",
    badge: "EXCLUSIVE",
    image_url: "/egyptian-streetwear-timeline.png",
    stock: 15,
    slug: "hieroglyph-bomber",
  },
  {
    id: "10",
    name: "SACRED SHORTS",
    description: "Cargo shorts with ankh embroidery on the pocket. Lightweight ripstop fabric. Sacred comfort for warm days.",
    price: 179900,
    category: "Bottoms",
    badge: "BESTSELLER",
    image_url: "/streetwear-egyptian-sketch.png",
    stock: 40,
    slug: "sacred-shorts",
  },
  {
    id: "11",
    name: "NEFERTITI HOODIE",
    description: "Slim cut hoodie with Nefertiti silhouette screen print. 380gsm French terry. Pay tribute to the most beautiful queen.",
    price: 329900,
    category: "Hoodies",
    badge: "LIMITED",
    image_url: "/abstract-geometric-shapes.png",
    stock: 18,
    slug: "nefertiti-hoodie",
  },
  {
    id: "12",
    name: "PYRAMID TRACK PANTS",
    description: "Track pants with pyramid geometric pattern along the legs. Moisture-wicking fabric. Ancient geometry in motion.",
    price: 249900,
    category: "Bottoms",
    badge: "NEW",
    image_url: "/egyptian-streetwear-timeline.png",
    stock: 32,
    slug: "pyramid-track-pants",
  },
];

export const CATEGORIES = ["All", "Hoodies", "T-Shirts", "Jackets", "Bottoms", "Accessories"];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function fmt(price: number): string {
  // Prices are stored in cents (EGP minor units), exactly like the API and the
  // web storefront. The mobile catalog used to store major units (e.g. 3499)
  // while the checkout request forwarded them as `unit_amount`, charging
  // customers 1/100th of the listed price.
  return `EGP ${(price / 100).toLocaleString("en-EG")}`;
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  BESTSELLER: { bg: "#C89D29", text: "#1B1B1B" },
  LIMITED:    { bg: "#AE1C1C", text: "#FFFFFF" },
  NEW:        { bg: "#1D4D4F", text: "#FFFFFF" },
  TRENDING:   { bg: "#213D9A", text: "#FFFFFF" },
  EXCLUSIVE:  { bg: "#4B0082", text: "#FFFFFF" },
  UTILITY:    { bg: "#1B1B1B", text: "#FDF8EF" },
};

export function getImageUrl(path: string): string {
  /**
   * Product/brand images live in the web storefront's `public/` directory, so
   * they are served by the Vite dev server in development and by the deployed
   * storefront in production. `EXPO_PUBLIC_DOMAIN` is the Expo build host, not
   * an asset host, so it must not be used here.
   */
  const assetUrl =
    process.env.EXPO_PUBLIC_ASSET_URL ??
    (__DEV__ ? "http://localhost:5173" : "https://greece-hieroglyphs.com");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${assetUrl}${normalizedPath}`;
}

export function getApiBase(): string {
  /**
   * `EXPO_PUBLIC_DOMAIN` previously dictated the API URL, but that variable is
   * the host of the Expo Go static bundle — nothing serves an API there, so
   * every request 404'd. The dev fallback also pointed at Metro's port 8080
   * instead of the API server (3001).
   */
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) return apiUrl.replace(/\/+$/, "");
  return __DEV__ ? "http://localhost:3001/api" : "https://greece-api.vercel.app/api";
}
