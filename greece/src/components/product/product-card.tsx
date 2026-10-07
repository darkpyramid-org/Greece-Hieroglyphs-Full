import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";
import { useLang } from "@/contexts/lang-context";
import { translations } from "@/i18n";
import { fmt, BADGE_STYLES } from "@/lib/products-data";
import { getTranslatedProduct } from "@/lib/product-translations";
import type { Product } from "@/lib/types";

const BG_MAP: Record<string, string> = {
  Hoodies:     "#D6C99A",
  "T-Shirts":  "#B8D4D8",
  Jackets:     "#C4B5A0",
  Bottoms:     "#C8D4B0",
  Accessories: "#D4B8B8",
};

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, openCart } = useCart();
  const { lang, t } = useLang();
  const [imgError, setImgError] = useState(false);
  const bgColor = BG_MAP[product.category] ?? "#E4D5B7";

  const collT = translations[lang].collection;
  const translatedProduct = getTranslatedProduct(product, lang);

  const translatedBadge = product.badge
    ? (collT.badges as Record<string, string>)[product.badge] ?? product.badge
    : null;

  const translatedCategory = (collT.categories as Record<string, string>)[product.category] ?? product.category;

  const onlyLeftText = t("common.onlyLeft").replace("{{n}}", String(product.stock));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${translatedProduct.name} ${collT.product.addedMsg}`, {
      action: { label: collT.product.viewCartAction, onClick: openCart },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.42) }}
      className="greece-card group"
    >
      <Link href={`/product/${product.slug ?? product.id}`} className="block relative overflow-hidden rounded-t-[14px]">
        <div className="aspect-[4/5] relative" style={{ background: bgColor }}>
          <img
            src={imgError ? "/placeholder.jpg" : product.imageUrl}
            alt={`${translatedProduct.name} — GREECE Egyptian Streetwear`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        </div>
        {translatedBadge && (
          <span className={`absolute top-3 left-3 text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md ${
            BADGE_STYLES[product.badge!] ?? "bg-[#1B1B1B] text-[#FDF8EF]"
          }`}>
            {translatedBadge}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1B1B1B]/35">
          <span className="bg-[#FDF8EF] text-[#1B1B1B] px-4 py-2 text-xs font-black hieroglyph-font flex items-center gap-2 rounded-md shadow-lg">
            <Eye className="h-3.5 w-3.5" />
            {t("common.quickView")}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <span className="text-[10px] font-black hieroglyph-font text-[#C89D29] tracking-widest">
              {translatedCategory}
            </span>
            <h3 className="text-sm font-black hieroglyph-font mt-0.5 leading-tight text-[#1B1B1B] dark:text-[#FDF8EF] line-clamp-1">
              {translatedProduct.name}
            </h3>
          </div>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="text-[10px] font-bold text-[#AE1C1C] dark:text-[#F87171] whitespace-nowrap shrink-0 mt-0.5">
              {onlyLeftText}
            </span>
          )}
        </div>
        <p className="text-xs text-[#1B1B1B]/55 dark:text-[#FDF8EF]/55 line-clamp-2 leading-relaxed mb-3">
          {translatedProduct.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-black text-[#C89D29]">{fmt(product.price)}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] dark:hover:text-[#1B1B1B] px-3 py-2 rounded-lg text-xs font-black transition-all active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {t("common.add")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
