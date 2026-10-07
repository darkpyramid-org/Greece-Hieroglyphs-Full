import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle2, Minus, Plus, Star, Ruler, RotateCcw, Shield, Zap } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { useCart } from "@/contexts/cart-context";
import { useLang } from "@/contexts/lang-context";
import { getProductById, fmt, BADGE_STYLES, PRODUCTS } from "@/lib/products-data";
import { getTranslatedProduct } from "@/lib/product-translations";
import { SEO } from "@/components/seo/seo";
import { getProductSEO } from "@/lib/seo-data";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const TRUST = [
  { icon: RotateCcw, label: "FREE RETURNS", sub: "14-day policy" },
  { icon: Shield, label: "SECURE PAYMENT", sub: "Stripe protected" },
  { icon: Zap, label: "FAST SHIPPING", sub: "2–5 business days" },
];

export default function ProductPage({ id }: { id: string }) {
  const product = getProductById(id);
  const { addToCart, openCart } = useCart();
  const { lang } = useLang();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Don't fire `setAdded` after the page has unmounted.
  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  const translatedProduct = product ? getTranslatedProduct(product, lang) : null;
  const productSEO = product ? getProductSEO({
    // Internal links use the slug verbatim, so the canonical URL must too —
    // this used to emit `/product/1` while every card linked to `/product/horus-hoodie`.
    id: product.slug ?? product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: [product.imageUrl],
    badge: product.badge ?? undefined,
    category: product.category
  }) : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF8EF] dark:bg-[#1A1410] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl block mb-4 text-[#C89D29]/30">𓂀</span>
            <h1 className="text-2xl font-black hieroglyph-font mb-4">PRODUCT NOT FOUND</h1>
            <Link href="/collection" className="text-[#C89D29] font-bold hover:underline">← Back to Collection</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addToCart(product, selectedSize);
    setAdded(true);
    toast.success(`${translatedProduct?.name || product.name} (${selectedSize}) × ${quantity} added! 𓋹`, {
      action: { label: "View Cart", onClick: openCart },
    });
    // Cleared on unmount / re-click so the timer never fires after navigation.
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDF8EF] dark:bg-[#1A1410] flex flex-col">
      {productSEO && <SEO {...productSEO} />}
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#1B1B1B]/40 dark:text-[#FDF8EF]/40 mb-8">
            <Link href="/" className="hover:text-[#C89D29] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collection" className="hover:text-[#C89D29] transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-[#1B1B1B]/70 dark:text-[#FDF8EF]/70 font-medium">{translatedProduct?.name || product.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="greece-card overflow-hidden">
                <div className="relative aspect-[4/5] bg-[#E4D5B7] dark:bg-[#2A1E14]">
                  <img
                    src={product.imageUrl}
                    alt={`${translatedProduct?.name || product.name} — GREECE Egyptian Streetwear`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                  />
                  {product.badge && (
                    <span className={`absolute top-4 left-4 text-xs font-black px-3 py-1.5 rounded-md ${BADGE_STYLES[product.badge] ?? "bg-[#1B1B1B] text-[#FDF8EF]"}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
              <div>
                <span className="text-xs font-black hieroglyph-font text-[#C89D29] tracking-widest">{product.category}</span>
                <h1 className="text-3xl sm:text-4xl font-black hieroglyph-font mt-1 leading-tight text-[#1B1B1B] dark:text-[#FDF8EF]">{translatedProduct?.name || product.name}</h1>
                <div className="flex items-center gap-1.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C89D29] text-[#C89D29]" />
                  ))}
                  <span className="text-xs text-[#1B1B1B]/40 dark:text-[#FDF8EF]/40 ml-1">4.9 (128 reviews)</span>
                </div>
              </div>

              <div className="text-4xl font-black text-[#C89D29]">{fmt(product.price)}</div>
              <p className="text-[#1B1B1B]/65 dark:text-[#FDF8EF]/65 leading-relaxed text-sm">{translatedProduct?.description || product.description}</p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black hieroglyph-font tracking-wider text-[#1B1B1B] dark:text-[#FDF8EF]">
                    SIZE — <span className="text-[#C89D29]">{selectedSize}</span>
                  </p>
                  <Link href="/size-guide" className="flex items-center gap-1 text-xs text-[#1B1B1B]/45 dark:text-[#FDF8EF]/45 hover:text-[#C89D29] transition-colors">
                    <Ruler className="h-3 w-3" /> Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 text-xs font-black border-2 rounded-lg transition-all ${
                        selectedSize === s
                          ? "bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] border-[#1B1B1B] dark:border-[#FDF8EF] shadow-md"
                          : "bg-transparent border-[#1B1B1B]/15 dark:border-[#FDF8EF]/15 text-[#1B1B1B] dark:text-[#FDF8EF] hover:border-[#C89D29] hover:text-[#C89D29]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black hieroglyph-font tracking-wider mb-2 text-[#1B1B1B] dark:text-[#FDF8EF]">QUANTITY</p>
                <div className="flex items-center border border-[#1B1B1B]/15 dark:border-[#FDF8EF]/15 rounded-lg overflow-hidden w-fit">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B]/5 dark:hover:bg-[#FDF8EF]/5 transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="w-12 text-center font-bold border-x border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 text-[#1B1B1B] dark:text-[#FDF8EF]">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))} className="w-11 h-11 flex items-center justify-center text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B]/5 dark:hover:bg-[#FDF8EF]/5 transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <button onClick={handleAdd}
                className="w-full bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] py-4 px-6 font-black hieroglyph-font text-sm sketchy-button transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                {added ? (
                  <><CheckCircle2 className="h-5 w-5" /> ADDED TO CART!</>
                ) : (
                  <><ShoppingBag className="h-5 w-5" /> ADD TO CART — {fmt(product.price * quantity)}</>
                )}
              </button>

              <div className="grid grid-cols-3 gap-3">
                {TRUST.map((t) => (
                  <div key={t.label} className="greece-card p-3 text-center">
                    <t.icon className="h-5 w-5 text-[#C89D29] mx-auto mb-1.5" />
                    <p className="text-[9px] font-black hieroglyph-font text-[#1B1B1B]/60 dark:text-[#FDF8EF]/60 tracking-wider leading-tight">{t.label}</p>
                    <p className="text-[9px] text-[#1B1B1B]/35 dark:text-[#FDF8EF]/35 mt-0.5">{t.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {related.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-8 bg-[#C89D29] sketchy-line" />
                <h2 className="text-xl font-black hieroglyph-font text-[#1B1B1B] dark:text-[#FDF8EF]">YOU MAY ALSO LIKE</h2>
                <div className="flex-1 h-px bg-[#1B1B1B]/6 dark:bg-[#FDF8EF]/6" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
