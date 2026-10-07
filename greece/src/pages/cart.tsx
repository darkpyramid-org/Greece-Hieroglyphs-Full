import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Loader2, Tag, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { fmt, shippingFeeFor, amountToFreeShipping } from "@/lib/products-data";
import { apiClient } from "@/lib/api-client";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";
import type { ShippingAddress } from "@/types";

interface CheckoutForm {
  customerEmail: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
}

const EMPTY_FORM: CheckoutForm = {
  customerEmail: "",
  customerName: "",
  phone: "",
  address: "",
  city: "",
  governorate: "",
  postalCode: "",
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [, navigate] = useLocation();
  const { t } = useLang();

  const shippingFee = shippingFeeFor(total);
  const orderTotal = total + shippingFee;
  const remaining = amountToFreeShipping(total);

  const setField = (key: keyof CheckoutForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleCheckout = async () => {
    if (!items.length) return;
    setLoading(true);
    try {
      const origin = window.location.origin;
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

      /**
       * Routed through `apiClient` so `VITE_API_URL` is honoured. This page used
       * to `fetch("${basePath}/api/checkout")` against its own origin, which the
       * Vercel rewrite answers with the SPA's `index.html` — so in production
       * checkout always failed with a JSON parse error.
       */
      const data = await apiClient.checkout.create({
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          ...(item.size ? { size: item.size } : {}),
        })),
        customerEmail: form.customerEmail.trim(),
        customerName: form.customerName.trim(),
        shippingAddress: {
          fullName: form.customerName.trim(),
          email: form.customerEmail.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          governorate: form.governorate.trim(),
          postalCode: form.postalCode.trim(),
        } satisfies ShippingAddress,
        successUrl: `${origin}${basePath}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}${basePath}/cart`,
      });

      if (!data.url) {
        throw new Error("Checkout failed — no payment URL was returned");
      }

      if (data.url.startsWith("https://checkout.stripe.com")) {
        // Hand off to Stripe. The cart is cleared by the success page, and only
        // once the customer actually comes back from the payment page.
        window.location.href = data.url;
        return;
      }

      // Mock / demo flow: the API returned a same-origin success URL.
      const path =
        data.url.replace(origin, "").replace(basePath, "") ||
        "/checkout/success";
      clearCart();
      navigate(path);
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Checkout failed — please try again";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitCheckoutForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.customerEmail.trim() || !form.customerName.trim()) {
      toast.error("Please enter your name and email so we can reach you.");
      return;
    }
    if (!form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error("Please complete your delivery details.");
      return;
    }

    void handleCheckout();
  };

  return (
    <div className="min-h-screen bg-[#FDF8EF] dark:bg-[#1A1410] flex flex-col">
      <SEO {...(SEO_DATA.cart as any)} />
      <Navbar />

      <section className="py-12 bg-gradient-to-b from-[#E4D5B7]/40 to-[#FDF8EF] dark:from-[#2A1E14]/40 dark:to-[#1A1410]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-7 w-7 text-[#C89D29]" />
            <h1 className="text-3xl font-black hieroglyph-font text-[#1B1B1B] dark:text-[#FDF8EF]">{t("cart.cartPageTitle")}</h1>
            <span className="text-sm text-[#1B1B1B]/40 dark:text-[#FDF8EF]/40 font-semibold">
              ({items.length} {items.length !== 1 ? t("cart.itemCountPlural") : t("cart.itemCount")})
            </span>
          </div>
        </div>
      </section>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {items.length === 0 ? (
              <div className="greece-card text-center py-24 px-8">
                <span className="text-7xl block mb-6 text-[#C89D29]/30">𓋹</span>
                <p className="font-black hieroglyph-font text-[#1B1B1B]/30 dark:text-[#FDF8EF]/30 tracking-widest text-sm mb-2">{t("cart.noItems")}</p>
                <Link href="/collection" className="inline-flex items-center gap-2 bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] px-6 py-3 font-black hieroglyph-font text-sm sketchy-button transition-all mt-6">
                  <ShoppingBag className="h-4 w-4" /> {t("cart.browseCollection")}
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                  {remaining > 0 && (
                    <div className="bg-[#C89D29]/10 dark:bg-[#C89D29]/15 border border-[#C89D29]/30 rounded-xl p-3.5 flex items-center gap-3 text-sm">
                      <Tag className="h-4 w-4 text-[#C89D29] shrink-0" />
                      <span className="text-[#1B1B1B]/70 dark:text-[#FDF8EF]/70">
                        Add <strong className="text-[#1B1B1B] dark:text-[#FDF8EF]">{fmt(remaining)}</strong> more for free shipping!
                      </span>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${item.size ?? "default"}`}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="greece-card flex gap-4 p-4"
                      >
                        <Link
                          href={`/product/${item.product.slug ?? item.product.id}`}
                          className="relative w-24 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-[#E4D5B7] dark:bg-[#2A1E14]"
                        >
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </Link>
                        <div className="flex-1">
                          <span className="text-[10px] font-black hieroglyph-font text-[#C89D29] tracking-widest">{item.product.category}</span>
                          <h3 className="font-black hieroglyph-font text-sm mt-0.5 text-[#1B1B1B] dark:text-[#FDF8EF]">{item.product.name}</h3>
                          {item.size && (
                            <p className="text-xs text-[#1B1B1B]/40 dark:text-[#FDF8EF]/40 mt-0.5">
                              {t("cart.sizeLabel")}: {item.size}
                            </p>
                          )}
                          <p className="font-black text-[#C89D29] text-base mt-1">{fmt(item.product.price * item.quantity)}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-[#1B1B1B]/15 dark:border-[#FDF8EF]/15 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${item.product.name}`}
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                                className="w-8 h-8 flex items-center justify-center text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B]/5 dark:hover:bg-[#FDF8EF]/5 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold border-x border-[#1B1B1B]/10 dark:border-[#FDF8EF]/10 text-[#1B1B1B] dark:text-[#FDF8EF]">{item.quantity}</span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${item.product.name}`}
                                // Don't offer more units than exist in stock.
                                disabled={item.quantity >= item.product.stock}
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                                className="w-8 h-8 flex items-center justify-center text-[#1B1B1B] dark:text-[#FDF8EF] hover:bg-[#1B1B1B]/5 dark:hover:bg-[#FDF8EF]/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                removeFromCart(item.product.id, item.size);
                                toast.success(`${item.product.name} ${t("cart.removed")}`);
                              }}
                              className="flex items-center gap-1 text-xs text-[#1B1B1B]/35 dark:text-[#FDF8EF]/35 hover:text-[#AE1C1C] dark:hover:text-[#F87171] transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> {t("cart.remove")}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Link href="/collection" className="inline-flex items-center gap-2 text-sm text-[#1B1B1B]/45 dark:text-[#FDF8EF]/45 hover:text-[#C89D29] transition-colors font-semibold mt-2">
                    <ArrowLeft className="h-4 w-4" /> {t("cart.continueShopping")}
                  </Link>
                </div>

                <div className="greece-card p-6 h-fit space-y-4">
                  <h2 className="font-black hieroglyph-font tracking-wider text-sm text-[#1B1B1B] dark:text-[#FDF8EF] pb-3 border-b border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8">
                    {t("cart.orderSummary")}
                  </h2>
                  <div className="border-t border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#1B1B1B]/55 dark:text-[#FDF8EF]/55">{t("cart.subtotal")}</span>
                      <span className="font-bold text-[#1B1B1B] dark:text-[#FDF8EF]">{fmt(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#1B1B1B]/55 dark:text-[#FDF8EF]/55">{t("cart.shipping")}</span>
                      <span className={`font-bold ${shippingFee === 0 ? "text-[#1D4D4F] dark:text-[#4A9EA1]" : "text-[#1B1B1B] dark:text-[#FDF8EF]"}`}>
                        {shippingFee === 0 ? t("common.free") : fmt(shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8">
                      <span className="font-black hieroglyph-font text-sm tracking-wider text-[#1B1B1B] dark:text-[#FDF8EF]">{t("cart.total")}</span>
                      <span className="font-black text-[#C89D29] text-2xl">{fmt(orderTotal)}</span>
                    </div>
                  </div>
                  {showCheckout ? (
                    <form
                      onSubmit={submitCheckoutForm}
                      className="space-y-3 border-t border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8 pt-4"
                    >
                      <h3 className="font-black hieroglyph-font tracking-wider text-sm text-[#1B1B1B] dark:text-[#FDF8EF]">
                        DELIVERY DETAILS
                      </h3>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label htmlFor="checkout-name" className="block text-[10px] font-black hieroglyph-font tracking-wider mb-1 section-faint">
                            FULL NAME *
                          </label>
                          <input
                            id="checkout-name"
                            name="name"
                            value={form.customerName}
                            onChange={setField("customerName")}
                            required
                            autoComplete="name"
                            className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                          />
                        </div>
                        <div>
                          <label htmlFor="checkout-email" className="block text-[10px] font-black hieroglyph-font tracking-wider mb-1 section-faint">
                            EMAIL *
                          </label>
                          <input
                            id="checkout-email"
                            name="email"
                            type="email"
                            value={form.customerEmail}
                            onChange={setField("customerEmail")}
                            required
                            autoComplete="email"
                            className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                          />
                        </div>
                        <div>
                          <label htmlFor="checkout-phone" className="block text-[10px] font-black hieroglyph-font tracking-wider mb-1 section-faint">
                            PHONE *
                          </label>
                          <input
                            id="checkout-phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={setField("phone")}
                            required
                            autoComplete="tel"
                            className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                          />
                        </div>
                        <div>
                          <label htmlFor="checkout-address" className="block text-[10px] font-black hieroglyph-font tracking-wider mb-1 section-faint">
                            STREET ADDRESS *
                          </label>
                          <input
                            id="checkout-address"
                            name="address"
                            value={form.address}
                            onChange={setField("address")}
                            required
                            autoComplete="street-address"
                            className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="checkout-city" className="block text-[10px] font-black hieroglyph-font tracking-wider mb-1 section-faint">
                              CITY *
                            </label>
                            <input
                              id="checkout-city"
                              name="city"
                              value={form.city}
                              onChange={setField("city")}
                              required
                              autoComplete="address-level2"
                              className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                            />
                          </div>
                          <div>
                            <label htmlFor="checkout-governorate" className="block text-[10px] font-black hieroglyph-font tracking-wider mb-1 section-faint">
                              GOVERNORATE
                            </label>
                            <input
                              id="checkout-governorate"
                              name="governorate"
                              value={form.governorate}
                              onChange={setField("governorate")}
                              autoComplete="address-level1"
                              className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] py-3 px-6 font-black hieroglyph-font text-sm sketchy-button transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> {t("cart.proceedCheckout")}</>
                          ) : (
                            <><ArrowRight className="h-4 w-4" /> {t("cart.proceedCheckout")}</>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCheckout(false)}
                          className="px-3 py-3 text-[#1B1B1B]/50 dark:text-[#FDF8EF]/50 hover:text-[#AE1C1C] dark:hover:text-[#F87171] transition-colors"
                          aria-label="Cancel checkout"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCheckout(true)}
                      disabled={loading}
                      className="w-full bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] py-3.5 px-6 font-black hieroglyph-font text-sm sketchy-button transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> {t("cart.proceedCheckout")}</>
                      ) : (
                        <><ArrowRight className="h-4 w-4" /> {t("cart.proceedCheckout")}</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
