import { Link } from "wouter";
import { Eye, Crown, Pyramid, Zap, Heart, Users } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";
import { translations } from "@/i18n";

const VALUE_ICONS = [Crown, Pyramid, Zap, Heart, Users, Eye];

export default function StoryPage() {
  const { t, lang } = useLang();
  const storyT = translations[lang].pages.story;

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.story} />
      <Navbar />

      {/* ── HERO ── */}
      <PageHeader
        Icon={Eye}
        title={t("pages.story.heroTitle")}
        titleGold={t("pages.story.heroTitleGold")}
        subtitle={t("pages.story.heroDesc")}
        variant="ink"
      />

      {/* Wave: Hero → Where It Began */}
      <WaveDivider from="ink" to="paper" variant={2} />

      {/* ── WHERE IT BEGAN ── */}
      <section className="py-20 section-paper">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black hieroglyph-font section-heading">
                {t("pages.story.whereTitle")} <span className="text-[#C89D29]">{t("pages.story.whereTitleGold")}</span>
              </h2>
              <p className="section-muted leading-relaxed">{storyT.whereP1}</p>
              <p className="section-muted leading-relaxed">{storyT.whereP2}</p>
            </div>
            <div className="relative">
              <div className="sketchy-border-thick p-3 section-paper shadow-[8px_8px_0_rgba(27,27,27,0.15)] dark:shadow-[8px_8px_0_rgba(0,0,0,0.4)] rotate-1">
                <img src="/egyptian-streetwear-timeline.png" alt="GREECE heritage timeline" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: Where It Began → Timeline */}
      <WaveDivider from="paper" to="sand" variant={4} flip />

      {/* ── TIMELINE ── */}
      <section className="py-20 section-sand">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black hieroglyph-font mb-3 section-heading">
              {t("pages.story.timelineTitle")} <span className="text-[#C89D29]">{t("pages.story.timelineTitleGold")}</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#C89D29]/30" />
            <div className="space-y-10">
              {storyT.timeline.map((item, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C89D29] text-[#1B1B1B] flex items-center justify-center font-black text-xs hieroglyph-font z-10 shadow-md">
                    {i + 1}
                  </div>
                  <div className="greece-card p-5 flex-1">
                    <span className="text-[#C89D29] text-xs font-black hieroglyph-font tracking-widest">{item.year}</span>
                    <h3 className="font-black hieroglyph-font text-sm mt-1 mb-2 section-heading">{item.title}</h3>
                    <p className="section-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave: Timeline → Values */}
      <WaveDivider from="sand" to="ink" variant={3} />

      {/* ── VALUES ── */}
      <section className="py-20 section-ink text-[#FDF8EF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black hieroglyph-font mb-3">
              {t("pages.story.valuesTitle")} <span className="text-[#C89D29]">{t("pages.story.valuesTitleGold")}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {storyT.values.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <div key={i} className="bg-[#FDF8EF]/5 border border-[#FDF8EF]/10 rounded-xl p-6 hover:bg-[#FDF8EF]/8 transition-colors group">
                  <Icon className="h-8 w-8 text-[#C89D29] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-black hieroglyph-font text-sm mb-2">{v.title}</h3>
                  <p className="text-[#FDF8EF]/55 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave: Values → CTA */}
      <WaveDivider from="ink" to="gold" variant={1} flip />

      {/* ── CTA ── */}
      <section className="py-16 section-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black hieroglyph-font text-[#1B1B1B] mb-4">{t("pages.story.ctaTitle")}</h2>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 bg-[#1B1B1B] text-[#FDF8EF] hover:bg-[#FDF8EF] hover:text-[#1B1B1B] px-8 py-3.5 font-black hieroglyph-font text-sm sketchy-button transition-all"
          >
            <Crown className="h-4 w-4" /> {t("pages.story.ctaBtn")}
          </Link>
        </div>
      </section>

      {/* Wave: CTA → Footer */}
      <WaveDivider from="gold" to="ink" variant={5} />

      <Footer />
    </div>
  );
}
