import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Send, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { apiClient } from "@/lib/api-client";
import { useLang } from "@/contexts/lang-context";
import { translations } from "@/i18n";

const INFO_ICONS = [MapPin, Mail, Clock];

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-center justify-between gap-4 hover:text-[#C89D29] transition-colors group section-heading"
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
          className="pb-5 text-sm section-muted leading-relaxed overflow-hidden"
        >
          {item.a}
        </motion.div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { t, lang } = useLang();
  const contactT = translations[lang].contact;

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(contactT.errorRequired);
      return;
    }
    setSending(true);
    try {
      // Routed through `apiClient` so `VITE_API_URL` is respected — the raw
      // same-origin fetch this page used received the SPA's `index.html` from
      // Vercel and reported it as a send failure.
      await apiClient.contact.send({
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.subject.trim() ? { subject: form.subject.trim() } : {}),
        message: form.message.trim(),
      });
      setSent(true);
      toast.success(contactT.successToast);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error(contactT.errorSend);
    } finally {
      setSending(false);
    }
  };

  const formFields = [
    { key: "name", label: contactT.fullName, type: "text", placeholder: contactT.namePlaceholder },
    { key: "email", label: contactT.email, type: "email", placeholder: contactT.emailPlaceholder },
    { key: "subject", label: contactT.subject, type: "text", placeholder: contactT.subjectPlaceholder },
  ];

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.contact} />
      <Navbar />

      {/* ── HEADER ── */}
      <PageHeader
        Icon={MessageCircle}
        title={t("contact.pageTitle")}
        titleGold={t("contact.pageTitleGold")}
        subtitle={t("contact.pageDesc")}
        variant="sand"
      />

      {/* Wave: Header → Main */}
      <WaveDivider from="sand" to="paper" variant={2} />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 py-12 section-paper">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-2xl font-black hieroglyph-font mb-6 section-heading">{t("contact.sendTitle")}</h2>
              {sent ? (
                <div className="greece-card p-8 text-center">
                  <span className="text-5xl block mb-4 text-[#C89D29]">𓋹</span>
                  <h3 className="font-black hieroglyph-font text-lg mb-2 section-heading">{t("contact.successTitle")}</h3>
                  <p className="text-sm section-muted">{t("contact.successMsg")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formFields.map((f) => (
                    <div key={f.key}>
                      <label htmlFor={`contact-${f.key}`} className="block text-xs font-black hieroglyph-font section-faint mb-1.5 tracking-wider">
                        {f.label}
                      </label>
                      <input
                        id={`contact-${f.key}`}
                        name={f.key}
                        type={f.type}
                        value={(form as Record<string, string>)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading placeholder:section-faint"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-black hieroglyph-font section-faint mb-1.5 tracking-wider">
                      {t("contact.message")}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("contact.messagePlaceholder")}
                      rows={5}
                      className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C89D29] transition-colors resize-none section-paper section-heading placeholder:section-faint"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] py-3 font-black hieroglyph-font text-sm sketchy-button transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? t("contact.sending") : t("contact.send")}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black hieroglyph-font mb-6 section-heading">{t("contact.infoTitle")}</h2>
              {contactT.info.map((item, i) => {
                const Icon = INFO_ICONS[i];
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#C89D29]/15 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-[#C89D29]" />
                    </div>
                    <div>
                      <p className="text-xs font-black hieroglyph-font section-faint tracking-widest mb-1">{item.label}</p>
                      <p className="text-sm font-semibold section-heading">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black hieroglyph-font mb-8 section-heading">
              {t("contact.faqTitle")} <span className="text-[#C89D29]">{t("contact.faqTitleGold")}</span>
            </h2>
            <div className="greece-card p-6 divide-y divide-[#1B1B1B]/8 dark:divide-[#FDF8EF]/8">
              {contactT.faqItems.map((item, i) => (
                <FAQItem key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Wave: Main → Footer */}
      <WaveDivider from="paper" to="ink" variant={4} flip />

      <Footer />
    </div>
  );
}
