import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { Link, useSearch } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/contexts/cart-context";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { fmt } from "@/lib/products-data";
import { useLang } from "@/contexts/lang-context";

export default function CheckoutSuccessPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);

  /**
   * Stripe redirects back with only `session_id`. The API no longer appends
   * `order_id` / `total` to the redirect URL (that leaked the order total into
   * browser history, server logs and the `Referer` header), so fall back to the
   * session id and let the track-order page resolve the real order.
   */
  const orderId = params.get("order_id") ?? params.get("session_id") ?? "—";
  const totalParam = params.get("total");
  const total = totalParam ? Number.parseInt(totalParam, 10) : null;

  const { clearCart } = useCart();
  const { t } = useLang();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#FDF8EF] dark:bg-[#1A1410] flex flex-col">
      <SEO {...(SEO_DATA.checkoutSuccess as any)} />
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 250 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-[#C89D29] flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-12 w-12 text-[#1B1B1B]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-5"
          >
            <div>
              <div className="text-4xl text-[#C89D29]/50 mb-3 select-none">𓋹</div>
              <h1 className="text-3xl font-black hieroglyph-font mb-2 text-[#1B1B1B] dark:text-[#FDF8EF]">
                {t("pages.checkoutSuccess.title")}
              </h1>
              <p className="text-[#1B1B1B]/55 dark:text-[#FDF8EF]/55 text-sm leading-relaxed">
                {t("pages.checkoutSuccess.desc")}
              </p>
            </div>

            <div className="greece-card p-5 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-black hieroglyph-font text-xs tracking-wider text-[#1B1B1B]/50 dark:text-[#FDF8EF]/50">
                  {t("pages.checkoutSuccess.orderId")}
                </span>
                <span className="font-bold text-[#C89D29] text-sm">{orderId.toString().slice(0, 22)}</span>
              </div>
              {total !== null && Number.isFinite(total) && (
                <div className="flex justify-between items-center border-t border-[#1B1B1B]/6 dark:border-[#FDF8EF]/6 pt-3">
                  <span className="font-black hieroglyph-font text-xs tracking-wider text-[#1B1B1B]/50 dark:text-[#FDF8EF]/50">
                    {t("pages.checkoutSuccess.totalPaid")}
                  </span>
                  {/* Totals are stored in cents, so format via `fmt()` — this
                      row used to render the raw number and show EGP 349,900 for
                      a EGP 3,499 order. */}
                  <span className="font-bold text-sm text-[#1B1B1B] dark:text-[#FDF8EF]">{fmt(total)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-[#1B1B1B]/6 dark:border-[#FDF8EF]/6 pt-3">
                <span className="font-black hieroglyph-font text-xs tracking-wider text-[#1B1B1B]/50 dark:text-[#FDF8EF]/50">
                  {t("pages.checkoutSuccess.status")}
                </span>
                <span className="text-[#1D4D4F] dark:text-[#4A9EA1] font-black text-xs">{t("pages.checkoutSuccess.confirmed")}</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#1B1B1B]/6 dark:border-[#FDF8EF]/6 pt-3">
                <span className="font-black hieroglyph-font text-xs tracking-wider text-[#1B1B1B]/50 dark:text-[#FDF8EF]/50">
                  {t("pages.checkoutSuccess.delivery")}
                </span>
                <span className="text-xs text-[#1B1B1B]/60 dark:text-[#FDF8EF]/60 font-semibold">{t("pages.checkoutSuccess.deliveryTime")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/collection"
                className="flex-1 bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] px-6 py-3 font-black hieroglyph-font text-xs sketchy-button transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> {t("pages.checkoutSuccess.shopMore")}
              </Link>
              <Link
                href="/track-order"
                className="flex-1 border-2 border-[#1B1B1B] dark:border-[#FDF8EF] text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B] hover:text-[#FDF8EF] dark:hover:bg-[#FDF8EF] dark:hover:text-[#1B1B1B] px-6 py-3 font-black hieroglyph-font text-xs rounded-md transition-all flex items-center justify-center gap-2"
              >
                <Package className="h-4 w-4" /> {t("pages.checkoutSuccess.trackOrder")}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
