import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";
import { useLang } from "@/contexts/lang-context";
import { getTranslatedProduct } from "@/lib/product-translations";
import { fmt, shippingFeeFor, amountToFreeShipping } from "@/lib/products-data";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const { lang } = useLang();
  const [, navigate] = useLocation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape must close the drawer; previously only the navbar popovers handled it,
  // so a keyboard user could get stuck in an open cart.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  // Shared cents-denominated helpers: this file previously redeclared the
  // threshold as a bare `1500`, which is 100x too small against cent prices.
  const shippingFee = shippingFeeFor(total);
  const remaining = amountToFreeShipping(total);

  const handleCheckout = () => {
    if (!items.length) return;
    closeCart();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1B1B1B]/60 backdrop-blur-sm"
            // The drawer can always be dismissed with Escape, so the backdrop
            // does not need to be a keyboard-reachable control itself.
            aria-hidden="true"
            onClick={closeCart}
          />
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col shadow-[-16px_0_40px_rgba(0,0,0,0.15)] bg-[#FDF8EF] dark:bg-[#1A1410]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#1B1B1B] dark:bg-[#0D0B09] text-[#FDF8EF]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-[#C89D29]" />
                <span className="font-black hieroglyph-font tracking-wider text-sm">
                  CART ({itemCount})
                </span>
              </div>
              <button onClick={closeCart} className="p-1.5 hover:text-[#C89D29] transition-colors rounded-md" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping banner */}
            {items.length > 0 && (
              <div className={`px-5 py-2.5 text-xs flex items-center gap-2 ${
                remaining > 0
                  ? "bg-[#C89D29]/10 dark:bg-[#C89D29]/15"
                  : "bg-[#1D4D4F]/10 dark:bg-[#1D4D4F]/20"
              }`}>
                <Tag className={`h-3.5 w-3.5 shrink-0 ${remaining > 0 ? "text-[#C89D29]" : "text-[#4A9EA1]"}`} />
                {remaining > 0
                  ? <span className="text-[#1B1B1B]/65 dark:text-[#FDF8EF]/65">Add <strong>{fmt(remaining)}</strong> for free shipping</span>
                  : <span className="text-[#1D4D4F] dark:text-[#4A9EA1] font-semibold">You've unlocked free shipping! 🎉</span>
                }
              </div>
            )}

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-16"
                  >
                    <span className="text-6xl text-[#C89D29]/30 select-none">𓋹</span>
                    <p className="font-black hieroglyph-font text-[#1B1B1B]/25 dark:text-[#FDF8EF]/25 text-xs tracking-widest">
                      YOUR CART IS EMPTY
                    </p>
                    <Link href="/collection" onClick={closeCart}
                      className="bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] px-5 py-2.5 text-xs font-black hieroglyph-font sketchy-button transition-all">
                      BROWSE COLLECTION
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => {
                    const translatedProduct = getTranslatedProduct(item.product, lang);
                    return (
                    <motion.div
                      key={`${item.product.id}-${item.size ?? "default"}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="greece-card flex gap-3 p-3"
                    >
                      <Link href={`/product/${item.product.slug ?? item.product.id}`} onClick={closeCart}
                        className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#E4D5B7] dark:bg-[#2A1E14]">
                        <img src={item.product.imageUrl} alt={translatedProduct.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black hieroglyph-font truncate text-[#1B1B1B] dark:text-[#FDF8EF]">
                          {translatedProduct.name}
                        </p>
                        {item.size && (
                          <p className="text-[10px] text-[#1B1B1B]/45 dark:text-[#FDF8EF]/45 mt-0.5">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-[#C89D29] font-black text-sm mt-1">
                          {fmt(item.product.price * item.quantity)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-md overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                              className="w-7 h-7 flex items-center justify-center text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B]/5 dark:hover:bg-[#FDF8EF]/5 transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold border-x border-[#1B1B1B]/10 dark:border-[#FDF8EF]/10 text-[#1B1B1B] dark:text-[#FDF8EF]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                              className="w-7 h-7 flex items-center justify-center text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B]/5 dark:hover:bg-[#FDF8EF]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label={`Increase quantity of ${translatedProduct.name}`}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.product.id, item.size);
                          toast.success(`${translatedProduct.name} removed`);
                        }}
                        className="p-1 text-[#1B1B1B]/25 dark:text-[#FDF8EF]/25 hover:text-[#AE1C1C] dark:hover:text-[#F87171] transition-colors self-start mt-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )})
                )}
              </AnimatePresence>
            </div>

            {/* Checkout footer */}
            {items.length > 0 && (
              <div className="border-t border-[#1B1B1B]/10 dark:border-[#FDF8EF]/10 p-4 bg-[#FDF8EF] dark:bg-[#221A12] space-y-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.25)]">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#1B1B1B]/55 dark:text-[#FDF8EF]/55">
                    <span>Subtotal</span>
                    <span className="font-semibold">{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1B1B1B]/55 dark:text-[#FDF8EF]/55">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shippingFee === 0 ? "text-[#1D4D4F] dark:text-[#4A9EA1]" : ""}`}>
                      {shippingFee === 0 ? "FREE" : fmt(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8">
                    <span className="font-black hieroglyph-font text-sm tracking-wider text-[#1B1B1B] dark:text-[#FDF8EF]">TOTAL</span>
                    <span className="font-black text-[#C89D29] text-xl">{fmt(total + shippingFee)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] dark:hover:text-[#1B1B1B] py-3 font-black hieroglyph-font text-sm sketchy-button transition-all flex items-center justify-center gap-2"
                >
                  CHECKOUT
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/collection" onClick={closeCart}
                  className="block text-center text-xs text-[#1B1B1B]/40 dark:text-[#FDF8EF]/40 hover:text-[#C89D29] transition-colors font-semibold">
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
