import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import {
  ShoppingBag, Eye, Crown, Pyramid, Zap, Users, Star, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WaveDivider from "@/components/ui/wave-divider";
import ProductCard from "@/components/product/product-card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { PRODUCTS } from "@/lib/products-data";
import { useLang } from "@/contexts/lang-context";
import { translations } from "@/i18n";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { t, lang } = useLang();
  const homeT = translations[lang].home;

  /**
   * `PRODUCTS` is reassigned in place by `setProducts()` after the collection
   * page fetches the real catalog, so this list must be computed during render.
   *
   * This used to be a module-level `const FEATURED = PRODUCTS.filter(...)`: it
   * was evaluated once at import time against `FALLBACK_PRODUCTS` and never
   * updated, so the homepage permanently featured the fallback catalog.
   */
  const featured = PRODUCTS.filter(
    (p) => p.badge && ["BESTSELLER", "NEW", "LIMITED"].includes(p.badge),
  ).slice(0, 3);

  const handleHeroShop = () => {
    toast.success("Entering the sacred collection... 𓋹");
  };

  return (
    <div className="min-h-screen section-paper overflow-x-hidden">
      <SEO {...SEO_DATA.home} />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center section-sand overflow-hidden">
        {["𓂀", "𓅃", "𓋹", "𓊖", "𓏃", "𓁿"].map((g, i) => (
          <motion.div
            key={i}
            className="absolute text-[#C89D29]/15 select-none pointer-events-none"
            style={{
              fontSize: `${2 + (i % 3)}rem`,
              top: `${10 + i * 15}%`,
              left: i % 2 === 0 ? `${5 + i * 8}%` : undefined,
              right: i % 2 !== 0 ? `${5 + i * 6}%` : undefined,
            }}
            animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {g}
          </motion.div>
        ))}

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-[#C89D29] text-[#1B1B1B] sketchy-border text-sm px-4 py-2 mb-4">
                {t("home.badge")}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black leading-tight hieroglyph-font hieroglyph-shadow section-heading">
                {t("home.heroTitle1")}
                <br />
                <motion.span
                  className="text-[#C89D29] inline-block"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {t("home.heroTitle2")}
                </motion.span>
                <br />
                {t("home.heroTitle3")}
              </h1>
              <p className="text-lg section-muted max-w-lg leading-relaxed mt-4">
                {t("home.heroDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="bg-[#1B1B1B] text-[#FDF8EF] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:bg-[#FDF8EF] dark:text-[#1B1B1B] dark:hover:bg-[#C89D29] sketchy-button text-base px-8 py-4 font-black">
                <Link href="/collection" onClick={handleHeroShop}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {t("common.shopTheCulture")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-[#1B1B1B] dark:border-[#FDF8EF] section-heading hover:bg-[#1B1B1B] hover:text-[#FDF8EF] dark:hover:bg-[#FDF8EF] dark:hover:text-[#1B1B1B] sketchy-button text-base px-8 py-4 font-black bg-transparent">
                <Link href="/story">{t("common.discoverStory")}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 flex-wrap pt-2"
            >
              {homeT.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-black text-[#C89D29]">{s.value}</div>
                  <div className="text-[10px] section-faint font-bold tracking-wider hieroglyph-font">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Hero Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden lg:flex items-stretch"
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-[#C89D29]/30 min-h-[520px]">
              <img
                src="/streetwear-egyptian-sketch.png"
                alt="GREECE Egyptian Streetwear"
                className="w-full h-auto object-contain"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1B1B1B]/75 to-transparent flex items-end justify-center pb-3">
                <span className="text-[10px] font-black hieroglyph-font text-[#C89D29] tracking-widest">ANCIENT POWER · MODERN FORM</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: ["12deg", "16deg", "12deg"] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-[#AE1C1C] text-[#FDF8EF] p-3 sketchy-border"
            >
              <span className="text-2xl">𓋹</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Wave: Hero → Sacred Streetwear */}
      <WaveDivider from="sand" to="paper" variant={1} />

      {/* ── SACRED STREETWEAR ── */}
      <section className="py-20 section-paper relative overflow-hidden">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-14">
            <div className="flex items-center justify-center mb-4 gap-4">
              <div className="h-1 w-14 bg-[#C89D29] sketchy-line" />
              <Eye className="h-8 w-8 text-[#C89D29]" />
              <div className="h-1 w-14 bg-[#C89D29] sketchy-line" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black hieroglyph-font mb-3 section-heading">{t("home.sacredTitle")}</h2>
            <p className="section-muted max-w-xl mx-auto">
              {t("home.sacredDesc")}
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <FadeUp className="text-center">
            <Link href="/collection">
              <Button
                size="lg"
                className="bg-[#1B1B1B] text-[#FDF8EF] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:bg-[#FDF8EF] dark:text-[#1B1B1B] dark:hover:bg-[#C89D29] sketchy-button font-black px-10"
              >
                {t("common.viewCollection")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Wave: Sacred Streetwear → Legacy */}
      <WaveDivider from="paper" to="sand" variant={3} flip />

      {/* ── LEGACY ── */}
      <section className="py-20 section-sand relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <Badge className="bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] sketchy-border text-sm px-4 py-2 mb-4">
                {t("home.legacyBadge")}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black hieroglyph-font mb-6 section-heading">
                {t("home.legacyTitle1")}
                <br />
                <span className="text-[#C89D29]">{t("home.legacyTitle2")}</span>
                <br />
                {t("home.legacyTitle3")}
              </h2>
              <p className="section-muted leading-relaxed mb-6">
                {t("home.legacyDesc")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center sketchy-border section-paper p-4">
                  <Pyramid className="h-7 w-7 text-[#C89D29] mx-auto mb-2" />
                  <div className="font-black hieroglyph-font text-sm section-heading">{t("home.heritage")}</div>
                  <div className="text-xs section-faint">{t("home.heritageDesc")}</div>
                </div>
                <div className="text-center sketchy-border section-paper p-4">
                  <Zap className="h-7 w-7 text-[#C89D29] mx-auto mb-2" />
                  <div className="font-black hieroglyph-font text-sm section-heading">{t("home.rebellion")}</div>
                  <div className="text-xs section-faint">{t("home.rebellionDesc")}</div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15} className="relative hidden lg:block">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-[#C89D29]/20">
                <img
                  src="/egyptian-streetwear-timeline.png"
                  alt="The GREECE Legacy"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1B]/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#C89D29]/50" />
                  <span className="text-[10px] font-black hieroglyph-font text-[#C89D29] tracking-widest whitespace-nowrap">5000 YEARS OF LEGACY</span>
                  <div className="h-px flex-1 bg-[#C89D29]/50" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Wave: Legacy → Modern Pharaohs */}
      <WaveDivider from="sand" to="ink" variant={4} />

      {/* ── MODERN PHARAOHS (Testimonials) ── */}
      <section className="py-20 section-ink relative overflow-hidden">
        <motion.div className="absolute top-10 left-10 text-8xl text-[#C89D29]/10 select-none" animate={{ rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity }}>𓂀</motion.div>
        <motion.div className="absolute bottom-10 right-10 text-7xl text-[#C89D29]/10 select-none" animate={{ rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity }}>𓅃</motion.div>

        <div className="container mx-auto px-4">
          <FadeUp className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black hieroglyph-font mb-3 text-[#FDF8EF]">
              {t("home.pharaohsTitle1")}<br /><span className="text-[#C89D29]">{t("home.pharaohsTitle2")}</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {homeT.testimonials.map((testimonial, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="section-paper rounded-2xl border border-[#FDF8EF]/20 dark:border-[#FDF8EF]/10 p-5 h-full shadow-lg">
                  <div className="flex text-[#C89D29] mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm section-muted italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-black hieroglyph-font text-xs section-heading">{testimonial.name}</p>
                    <p className="text-xs section-faint">{testimonial.location}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Modern Pharaohs → CTA */}
      <WaveDivider from="ink" to="gold" variant={2} />

      {/* ── CTA ── */}
      <section className="py-20 section-gold relative overflow-hidden">
        <div className="container mx-auto px-4">
          <FadeUp className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black hieroglyph-font text-[#1B1B1B]">
              {t("home.ctaTitle1")}<br /><span className="text-[#FDF8EF]">{t("home.ctaTitle2")}</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collection">
                <Button size="lg" className="bg-[#1B1B1B] text-[#FDF8EF] hover:bg-[#FDF8EF] hover:text-[#1B1B1B] sketchy-button font-black px-10 py-5 text-base">
                  <Crown className="h-5 w-5 mr-2" />
                  {t("common.shopCollection")}
                </Button>
              </Link>
              <Link href="/culture">
                <Button variant="outline" size="lg" className="border-2 border-[#1B1B1B] text-[#1B1B1B] hover:bg-[#1B1B1B] hover:text-[#FDF8EF] sketchy-button font-black px-10 py-5 text-base bg-transparent">
                  <Users className="h-5 w-5 mr-2" />
                  {t("home.joinCommunity")}
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Wave: CTA → Footer */}
      <WaveDivider from="gold" to="ink" variant={5} flip />

      <Footer />
    </div>
  );
}
