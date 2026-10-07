import { Link } from "wouter";
import { Eye } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";

const SYMBOLS = [
  { symbol: "𓋹", name: "ANKH", meaning: "Eternal Life & Power", desc: "The Ankh is the ancient Egyptian symbol for life, immortality, and divine power. Carried by pharaohs and gods alike, it represents the key to eternal existence." },
  { symbol: "𓂀", name: "EYE OF HORUS", meaning: "Protection & Royal Power", desc: "Wedjat — the Eye of Horus — is a symbol of protection, royal power, and good health. Our brand's guiding symbol." },
  { symbol: "𓁿", name: "SCARAB", meaning: "Transformation & Rebirth", desc: "The scarab beetle (Khepri) was the god of the rising sun and self-creation. Egyptians carved scarabs into amulets as symbols of regeneration." },
  { symbol: "𓇳", name: "SUN DISC (RA)", meaning: "The Source of All Power", desc: "Ra, the sun god, was the most powerful deity in the Egyptian pantheon. The sun disc represents creation, warmth, and omnipotent power." },
  { symbol: "𓅃", name: "FALCON (HORUS)", meaning: "Kingship & Divine Authority", desc: "The falcon was the manifestation of Horus, god of the sky and kingship. Every Egyptian pharaoh was considered the living Horus." },
  { symbol: "𓊖", name: "CARTOUCHE", meaning: "Identity & Immortality", desc: "A cartouche is an oval enclosure containing a pharaoh's royal name in hieroglyphs. To have your name in a cartouche meant immortality." },
];

const GODS = [
  { name: "HORUS", role: "Sky God & Protector", info: "God of the sky, war, and hunting. Patron of pharaohs. His eye (the Wedjat) is one of the most powerful symbols of protection in history." },
  { name: "RA", role: "Sun God & Creator", info: "The paramount deity of ancient Egypt. Creator of all life and order." },
  { name: "OSIRIS", role: "God of Death & Resurrection", info: "Ruler of the underworld and judge of the dead. His resurrection gave hope to all Egyptians of eternal life beyond death." },
  { name: "ANUBIS", role: "God of Mummification", info: "The jackal-headed guide of souls. He weighed the hearts of the dead against the feather of Ma'at." },
  { name: "THOTH", role: "God of Wisdom & Writing", info: "The ibis-headed god of knowledge, writing, science, and judgment. Inventor of hieroglyphs." },
  { name: "SEKHMET", role: "Goddess of War & Healing", info: "The lion-headed goddess of war and pestilence, but also of healing. She embodied both destruction and protection." },
];

export default function CulturePage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.culture} />
      <Navbar />

      {/* ── HERO ── */}
      <PageHeader
        glyph="𓋹"
        title={t("pages.culture.heroTitle")}
        titleGold={t("pages.culture.heroTitleGold")}
        subtitle={t("pages.culture.heroDesc")}
        variant="ink"
      />

      {/* Wave: Hero → Symbols */}
      <WaveDivider from="ink" to="paper" variant={3} />

      {/* ── SYMBOLS ── */}
      <section className="py-20 section-paper">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black hieroglyph-font mb-3 section-heading">
              {t("pages.culture.symbolsTitle")} <span className="text-[#C89D29]">{t("pages.culture.symbolsTitleGold")}</span>
            </h2>
            <p className="section-muted text-sm">{t("pages.culture.symbolsDesc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SYMBOLS.map((s, i) => (
              <div key={i} className="greece-card p-6 hover:shadow-[6px_6px_0_#C89D29] transition-all">
                <div className="text-5xl text-[#C89D29] mb-4">{s.symbol}</div>
                <div className="font-black hieroglyph-font text-sm section-heading mb-1">{s.name}</div>
                <div className="text-[#C89D29] text-[10px] font-bold tracking-widest hieroglyph-font mb-3">{s.meaning}</div>
                <p className="section-muted text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Symbols → Gods */}
      <WaveDivider from="paper" to="sand" variant={2} flip />

      {/* ── GODS ── */}
      <section className="py-20 section-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black hieroglyph-font mb-3 section-heading">
              {t("pages.culture.godsTitle")} <span className="text-[#C89D29]">{t("pages.culture.godsTitleGold")}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {GODS.map((g, i) => (
              <div key={i} className="greece-card p-5">
                <div className="font-black hieroglyph-font text-base section-heading mb-1">{g.name}</div>
                <div className="text-[#C89D29] text-[10px] font-bold tracking-widest hieroglyph-font mb-3">{g.role}</div>
                <p className="section-muted text-xs leading-relaxed">{g.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: Gods → CTA */}
      <WaveDivider from="sand" to="gold" variant={4} />

      {/* ── CTA ── */}
      <section className="py-16 section-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black hieroglyph-font text-[#1B1B1B] mb-4">{t("pages.culture.ctaTitle")}</h2>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 bg-[#1B1B1B] text-[#FDF8EF] hover:bg-[#FDF8EF] hover:text-[#1B1B1B] px-8 py-3.5 font-black hieroglyph-font text-sm sketchy-button transition-all"
          >
            <Eye className="h-4 w-4" /> {t("pages.culture.ctaBtn")}
          </Link>
        </div>
      </section>

      {/* Wave: CTA → Footer */}
      <WaveDivider from="gold" to="ink" variant={5} />

      <Footer />
    </div>
  );
}
