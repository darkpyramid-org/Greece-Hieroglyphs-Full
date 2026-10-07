import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Users, Star } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Link } from "wouter";
import WaveDivider from "@/components/ui/wave-divider";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";
import { translations } from "@/i18n";

const TESTIMONIALS = [
  { name: "MAYA K.", location: "Zamalek, Cairo", quote: "GREECE gave me a way to wear my Egyptian identity with pride. The Horus Hoodie is my signature piece everywhere I go.", rating: 5 },
  { name: "OMAR B.", location: "Alexandria", quote: "Finally, a brand that understands Egyptian culture on a deep level. I've learned so much about my heritage through the designs.", rating: 5 },
  { name: "SARA M.", location: "New Cairo", quote: "The quality is insane for the price. I've washed my Ankh Tee 30 times and it still looks brand new.", rating: 5 },
  { name: "HASSAN R.", location: "Heliopolis, Cairo", quote: "Wearing GREECE abroad always sparks conversations about Egypt. It's become my ambassador piece when I travel.", rating: 5 },
  { name: "LAYLA A.", location: "Maadi, Cairo", quote: "The Nefertiti Hoodie was a birthday gift from my partner and it's my most-worn piece.", rating: 5 },
  { name: "KAREEM S.", location: "Giza", quote: "I've been waiting for an Egyptian streetwear brand this authentic my whole life. GREECE bridges a gap that needed bridging.", rating: 5 },
];

export default function CommunityPage() {
  const { t, lang } = useLang();
  const communityT = translations[lang].pages.community;

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.community} />
      <Navbar />

      {/* ── HERO ── */}
      <PageHeader
        Icon={Users}
        title={t("pages.community.heroTitle")}
        titleGold={t("pages.community.heroTitleGold")}
        subtitle={t("pages.community.heroDesc")}
        variant="ink"
      />

      {/* Wave: Hero → Stats */}
      <WaveDivider from="ink" to="gold" variant={1} />

      {/* ── STATS ── */}
      <section className="py-12 section-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {communityT.stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-black hieroglyph-font text-[#1B1B1B] dark:text-[#FDF8EF]">{s.value}</div>
                <div className="text-[#1B1B1B]/60 dark:text-[#FDF8EF]/60 text-sm font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Stats → Testimonials */}
      <WaveDivider from="gold" to="paper" variant={3} flip />

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 section-paper">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black hieroglyph-font text-center mb-12 section-heading">
            {t("pages.community.pharaohsTitle")} <span className="text-[#C89D29]">{t("pages.community.pharaohsTitleGold")}</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="greece-card p-5 h-full">
                <div className="flex text-[#C89D29] mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm section-muted italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-black hieroglyph-font text-xs section-heading">{testimonial.name}</p>
                  <p className="text-xs section-faint">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Testimonials → CTA */}
      <WaveDivider from="paper" to="ink" variant={5} />

      {/* ── CTA ── */}
      <section className="py-16 section-ink">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black hieroglyph-font text-[#FDF8EF] mb-4">{t("pages.community.ctaTitle")}</h2>
          <p className="text-[#FDF8EF]/55 mb-8 max-w-md mx-auto text-sm">{t("pages.community.ctaDesc")}</p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 bg-[#C89D29] text-[#1B1B1B] hover:bg-[#FDF8EF] px-8 py-3.5 font-black hieroglyph-font text-sm sketchy-button transition-all"
          >
            <Users className="h-4 w-4" /> {t("pages.community.ctaBtn")}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
