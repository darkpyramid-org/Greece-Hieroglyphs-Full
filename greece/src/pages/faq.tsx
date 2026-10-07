import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";
import { translations } from "@/i18n";

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 hover:text-[#C89D29] transition-colors group section-heading"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm leading-snug">{item.q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#C89D29]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 section-faint group-hover:text-[#C89D29] transition-colors" />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pb-4 text-sm section-muted leading-relaxed overflow-hidden"
        >
          {item.a}
        </motion.div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { t, lang } = useLang();
  const faqT = translations[lang].faq;

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.faq} />
      <Navbar />

      {/* ── HEADER ── */}
      <PageHeader
        glyph="𓂀"
        title={t("faq.pageTitle")}
        titleGold={t("faq.pageTitleGold")}
        variant="sand"
      />

      {/* Wave: Header → Content */}
      <WaveDivider from="sand" to="paper" variant={3} />

      {/* ── FAQ CONTENT ── */}
      <main className="flex-1 py-12 section-paper">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          {faqT.categories.map((cat, i) => (
            <div key={i}>
              <h2 className="font-black hieroglyph-font text-xs text-[#C89D29] tracking-widest mb-4">
                {cat.category}
              </h2>
              <div className="greece-card p-4">
                {cat.items.map((item, j) => (
                  <FAQItem key={j} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Wave: Content → Footer */}
      <WaveDivider from="paper" to="ink" variant={5} />

      <Footer />
    </div>
  );
}
