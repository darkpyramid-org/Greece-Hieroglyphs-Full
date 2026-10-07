import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { Truck, RotateCcw, Shield } from "lucide-react";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";

const EGYPT_ZONES = [
  { zone: "Cairo & Giza", time: "2–3 business days", cost: "EGP 50", express: "Same-day available" },
  { zone: "Alexandria", time: "3–4 business days", cost: "EGP 60", express: "Next-day available" },
  { zone: "Nile Delta", time: "3–5 business days", cost: "EGP 65", express: "2-day available" },
  { zone: "Upper Egypt", time: "4–6 business days", cost: "EGP 75", express: "—" },
  { zone: "North Coast & Red Sea", time: "4–6 business days", cost: "EGP 75", express: "—" },
  { zone: "Sinai", time: "5–7 business days", cost: "EGP 85", express: "—" },
];

const INTERNATIONAL_ZONES = [
  { zone: "Saudi Arabia", time: "7–10 business days", cost: "EGP 350" },
  { zone: "UAE", time: "7–10 business days", cost: "EGP 380" },
  { zone: "Kuwait", time: "8–12 business days", cost: "EGP 390" },
  { zone: "Qatar & Bahrain", time: "8–12 business days", cost: "EGP 390" },
  { zone: "Jordan & Lebanon", time: "9–14 business days", cost: "EGP 420" },
];

export default function ShippingPage() {
  const { t } = useLang();
  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.shipping} />
      <Navbar />

      {/* ── HEADER ── */}
      <PageHeader
        Icon={Truck}
        title={t("pages.shipping.heroTitle")}
        titleGold={t("pages.shipping.heroTitleGold")}
        variant="sand"
      />

      {/* Wave: Header → Content */}
      <WaveDivider from="sand" to="paper" variant={2} flip />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 py-12 section-paper">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: "FREE SHIPPING", desc: "On orders over EGP 1,500" },
              { icon: RotateCcw, title: "14-DAY RETURNS", desc: "Hassle-free returns" },
              { icon: Shield, title: "SECURE PAYMENTS", desc: "Stripe-protected checkout" },
            ].map((item, i) => (
              <div key={i} className="greece-card p-5 text-center">
                <item.icon className="h-8 w-8 text-[#C89D29] mx-auto mb-3" />
                <p className="font-black hieroglyph-font text-sm mb-1 section-heading">{item.title}</p>
                <p className="text-xs section-faint">{item.desc}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-black hieroglyph-font mb-4 section-heading">EGYPT DELIVERY <span className="text-[#C89D29]">RATES</span></h2>
            <div className="overflow-x-auto rounded-xl overflow-hidden border border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12">
              <table className="w-full text-sm">
                <thead>
                  <tr className="section-ink text-[#FDF8EF]">
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">ZONE</th>
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">TIME</th>
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">COST</th>
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">EXPRESS</th>
                  </tr>
                </thead>
                <tbody>
                  {EGYPT_ZONES.map((z, i) => (
                    <tr key={i} className={`border-b border-[#1B1B1B]/6 dark:border-[#FDF8EF]/6 last:border-0 ${i % 2 === 0 ? "section-paper" : "section-sand"}`}>
                      <td className="p-3 font-medium section-heading">{z.zone}</td>
                      <td className="p-3 section-muted">{z.time}</td>
                      <td className="p-3 font-bold text-[#C89D29]">{z.cost}</td>
                      <td className="p-3 section-faint text-xs">{z.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black hieroglyph-font mb-4 section-heading">INTERNATIONAL <span className="text-[#C89D29]">SHIPPING</span></h2>
            <div className="overflow-x-auto rounded-xl overflow-hidden border border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12">
              <table className="w-full text-sm">
                <thead>
                  <tr className="section-ink text-[#FDF8EF]">
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">DESTINATION</th>
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">TIME</th>
                    <th className="text-left p-3 font-black hieroglyph-font text-xs tracking-wider">COST</th>
                  </tr>
                </thead>
                <tbody>
                  {INTERNATIONAL_ZONES.map((z, i) => (
                    <tr key={i} className={`border-b border-[#1B1B1B]/6 dark:border-[#FDF8EF]/6 last:border-0 ${i % 2 === 0 ? "section-paper" : "section-sand"}`}>
                      <td className="p-3 font-medium section-heading">{z.zone}</td>
                      <td className="p-3 section-muted">{z.time}</td>
                      <td className="p-3 font-bold text-[#C89D29]">{z.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="greece-card p-6">
            <h2 className="text-xl font-black hieroglyph-font mb-4 section-heading">RETURN <span className="text-[#C89D29]">POLICY</span></h2>
            <div className="space-y-3 text-sm section-muted leading-relaxed">
              <p>We accept returns within <strong className="section-heading">14 days</strong> of delivery for unworn, unwashed items with original tags attached.</p>
              <p>To initiate a return, email <strong className="section-heading">returns@greece-hieroglyphs.com</strong> with your order ID and reason for return.</p>
              <p>Once we receive and inspect your return, we'll process a full refund within 5–7 business days.</p>
              <p>Sale items and custom pieces are final sale.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Wave: Content → Footer */}
      <WaveDivider from="paper" to="ink" variant={1} />

      <Footer />
    </div>
  );
}
