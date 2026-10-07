import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/lang-context";

const CONSENT_KEY = "greece-consent";

export default function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(CONSENT_KEY);
      if (!existing) setVisible(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const handle = (accepted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined");
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-[9999] max-w-lg mx-auto"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="greece-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[6px_6px_0_#1B1B1B] dark:shadow-[6px_6px_0_rgba(253,248,239,0.15)]">
            <span className="text-2xl shrink-0">𓋹</span>
            <p className="text-xs section-muted leading-relaxed flex-1">
              {t("common.cookie.message")}
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handle(true)}
                className="px-4 py-2 bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] text-xs font-black hieroglyph-font sketchy-button hover:bg-[#C89D29] hover:text-[#1B1B1B] transition-all"
              >
                {t("common.cookie.accept")}
              </button>
              <button
                onClick={() => handle(false)}
                className="px-4 py-2 border-2 border-[#1B1B1B]/20 dark:border-[#FDF8EF]/20 section-heading text-xs font-black hieroglyph-font sketchy-button hover:border-[#C89D29] hover:text-[#C89D29] transition-all"
              >
                {t("common.cookie.decline")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
