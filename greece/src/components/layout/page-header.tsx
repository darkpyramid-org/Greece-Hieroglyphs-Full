import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const GLYPH_DECO = ["𓂀", "𓅃", "𓋹", "𓊖", "𓏃", "𓁿"];

const FLOAT_POS = [
  { top: "12%",  left:  "4%",  size: "1.6rem", delay: 0 },
  { top: "18%",  right: "5%",  size: "1.2rem", delay: 0.7 },
  { bottom:"15%",left:  "7%",  size: "1rem",   delay: 1.1 },
  { bottom:"10%",right: "8%",  size: "1.4rem", delay: 0.4 },
  { top: "45%",  left:  "1%",  size: "1.1rem", delay: 1.5 },
  { top: "40%",  right: "2%",  size: "1rem",   delay: 0.9 },
];

interface PageHeaderProps {
  /** Lucide icon component */
  Icon?: LucideIcon;
  /** Unicode hieroglyph character instead of icon */
  glyph?: string;
  title: string;
  titleGold: string;
  subtitle?: string;
  /** "sand" = warm tan bg (light pages), "ink" = near-black bg (dark pages) */
  variant?: "sand" | "ink";
  className?: string;
}

export default function PageHeader({
  Icon,
  glyph,
  title,
  titleGold,
  subtitle,
  variant = "sand",
  className = "",
}: PageHeaderProps) {
  const isInk = variant === "ink";

  const bg         = isInk ? "bg-[#1B1B1B] dark:bg-[#0D0B09]" : "section-sand";
  const headingCls = isInk ? "text-[#FDF8EF]" : "section-heading";
  const subCls     = isInk ? "text-[#FDF8EF]/65" : "section-muted";
  const glyphColor = "#C89D29";
  const glyphOpacity = isInk ? "0.12" : "0.18";

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 ${bg} ${className}`}>

      {/* ── SVG dot-grid background ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ph-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="1.2" fill={glyphColor} opacity={glyphOpacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ph-grid)" />
      </svg>

      {/* ── Gold shimmer sweep ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 30%, rgba(200,157,41,${isInk ? "0.06" : "0.10"}) 50%, transparent 70%)`,
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />

      {/* ── Floating hieroglyphs ── */}
      {FLOAT_POS.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none font-light"
          style={{
            fontSize: pos.size,
            color: glyphColor,
            opacity: isInk ? 0.14 : 0.22,
            ...pos,
          } as React.CSSProperties}
          animate={{ y: [-6, 6, -6], opacity: [isInk ? 0.1 : 0.16, isInk ? 0.22 : 0.3, isInk ? 0.1 : 0.16] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
        >
          {GLYPH_DECO[i % GLYPH_DECO.length]}
        </motion.span>
      ))}

      {/* ── Centered content ── */}
      <div className="relative z-10 container mx-auto px-4 text-center">

        {/* Icon / glyph row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-center gap-4 mb-5"
        >
          <motion.div
            className="h-0.5 w-14 rounded-full"
            style={{ background: glyphColor, opacity: 0.5 }}
            animate={{ scaleX: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {Icon && (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-8 w-8" style={{ color: glyphColor }} />
            </motion.div>
          )}
          {!Icon && glyph && (
            <motion.span
              className="text-3xl"
              style={{ color: glyphColor }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {glyph}
            </motion.span>
          )}
          <motion.div
            className="h-0.5 w-14 rounded-full"
            style={{ background: glyphColor, opacity: 0.5 }}
            animate={{ scaleX: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-4xl sm:text-6xl font-black hieroglyph-font hieroglyph-shadow mb-3 ${headingCls}`}
        >
          {title}{" "}
          <motion.span
            className="inline-block"
            style={{ color: glyphColor }}
            animate={{ textShadow: [`0 0 0px ${glyphColor}00`, `0 0 16px ${glyphColor}55`, `0 0 0px ${glyphColor}00`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            {titleGold}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-sm max-w-lg mx-auto leading-relaxed ${subCls}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* ── Bottom gold accent line ── */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${glyphColor}, transparent)` }}
        animate={{ width: ["20%", "60%", "20%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
