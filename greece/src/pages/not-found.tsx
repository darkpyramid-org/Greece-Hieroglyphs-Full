import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/theme-context";
import { useLang } from "@/contexts/lang-context";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";

const HIEROGLYPHS = ["𓂀", "𓃀", "𓆣", "𓇯", "𓈖", "𓊽", "𓋹", "𓌀", "𓍯", "𓎛", "𓏌", "𓐍"];

const GLYPHS_BG = [
  { glyph: "𓂀", delay: 0,   x: 5,  y: 20 },
  { glyph: "𓋹", delay: 0.8, x: 90, y: 15 },
  { glyph: "𓇯", delay: 1.6, x: 15, y: 72 },
  { glyph: "𓊽", delay: 2.2, x: 82, y: 68 },
  { glyph: "𓆣", delay: 0.4, x: 50, y: 4  },
  { glyph: "𓐍", delay: 1.2, x: 26, y: 48 },
  { glyph: "𓃀", delay: 2.8, x: 72, y: 42 },
  { glyph: "𓌀", delay: 0.6, x: 42, y: 82 },
];

function BgGlyph({ glyph, delay, x, y }: { glyph: string; delay: number; x: number; y: number }) {
  return (
    <motion.span
      className="absolute text-xl select-none pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, color: "#C89D29" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: [0, 0.22, 0.12, 0.28, 0], y: [16, -8, 0, -18, -36], rotate: [0, 5, -3, 7, 0] }}
      transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {glyph}
    </motion.span>
  );
}

export default function NotFound() {
  const [cycleIdx, setCycleIdx] = useState(0);
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === "dark";

  useEffect(() => {
    const timer = setInterval(() => setCycleIdx((n) => (n + 1) % HIEROGLYPHS.length), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8EF] dark:bg-[#1A1410] flex items-center justify-center overflow-hidden relative py-8">
      <SEO {...(SEO_DATA.notFound as any)} />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,157,41,0.09) 0%, transparent 70%)" }}
      />

      {/* Floating background glyphs */}
      {GLYPHS_BG.map((cfg, i) => <BgGlyph key={i} {...cfg} />)}

      {/* Horizontal rules */}
      <motion.div className="absolute left-0 right-0 h-px bg-[#C89D29]/15" style={{ top: "12%" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.3 }} />
      <motion.div className="absolute left-0 right-0 h-px bg-[#C89D29]/15" style={{ bottom: "12%" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-0">

        {/* Cycling hieroglyph icon */}
        <motion.div
          className="relative mb-5"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        >
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-2 border-[#C89D29]/30"
            style={{ background: "rgba(200,157,41,0.07)" }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={cycleIdx}
                className="text-4xl"
                style={{ color: "#C89D29" }}
                initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.3, rotate: -20 }}
                transition={{ duration: 0.35 }}
              >
                {HIEROGLYPHS[cycleIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.div
            className="absolute rounded-full border border-[#C89D29]/18"
            style={{ inset: "-9px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ inset: "-18px", border: isDark ? "1px solid rgba(253,248,239,0.05)" : "1px solid rgba(27,27,27,0.05)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* 404 */}
        <motion.div
          className="relative mb-1 leading-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
        >
          <span
            className="hieroglyph-font font-black select-none block"
            style={{
              fontSize: "clamp(4.5rem, 14vw, 7.5rem)",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: isDark ? "2px #FDF8EF" : "2px #1B1B1B",
              letterSpacing: "0.06em",
            }}
          >
            404
          </span>
          <motion.span
            className="absolute inset-0 hieroglyph-font font-black select-none flex items-center justify-center"
            style={{ fontSize: "clamp(4.5rem, 14vw, 7.5rem)", lineHeight: 1, letterSpacing: "0.06em", background: "linear-gradient(120deg, transparent 25%, #C89D29 50%, transparent 75%)", backgroundSize: "280% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            animate={{ backgroundPosition: ["250% center", "-250% center"] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "linear", delay: 0.9 }}
          >
            404
          </motion.span>
        </motion.div>

        {/* Tag line */}
        <motion.p
          className="hieroglyph-font text-[10px] tracking-[0.35em] text-[#C89D29] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t("pages.notFound.tagline")}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.62, duration: 0.55 }}
        >
          <div className="h-px w-14 bg-[#C89D29]/35" />
          <span className="text-[#C89D29] text-base">𓂀</span>
          <div className="h-px w-14 bg-[#C89D29]/35" />
        </motion.div>

        {/* Body copy */}
        <motion.p
          className="text-[#1B1B1B]/50 dark:text-[#FDF8EF]/50 text-[13px] max-w-[22rem] leading-relaxed mb-7"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
        >
          {t("pages.notFound.body")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 items-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.86 }}
        >
          <Link href="/">
            <motion.span
              className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hieroglyph-font text-[10px] tracking-widest cursor-pointer border-2 border-[#1B1B1B] dark:border-[#FDF8EF] rounded-lg"
              whileHover={{ scale: 1.03, boxShadow: "4px 4px 0 #C89D29" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {t("common.returnHome")}
            </motion.span>
          </Link>
          <Link href="/collection">
            <motion.span
              className="inline-flex items-center gap-2 px-7 py-2.5 hieroglyph-font text-[10px] tracking-widest cursor-pointer border-2 border-[#C89D29] text-[#C89D29] rounded-lg"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(200,157,41,0.09)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {t("common.viewColl")}
            </motion.span>
          </Link>
        </motion.div>

        {/* Bottom glyph strip */}
        <motion.div
          className="flex gap-3 text-[#C89D29]/20 text-lg select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
        >
          {["𓂀", "𓋹", "𓇯", "𓊽", "𓆣", "𓐍", "𓌀", "𓃀"].map((g, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 2.5, delay: i * 0.28, repeat: Infinity }}
            >
              {g}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
