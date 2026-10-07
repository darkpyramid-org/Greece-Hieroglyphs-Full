import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/i18n";

export type Lang = "en" | "ar";

function getNestedValue(obj: Record<string, unknown>, keys: string[]): string {
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key];
    } else {
      return keys.join(".");
    }
  }
  return typeof current === "string" ? current : keys.join(".");
}

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("greece-lang") as Lang | null;
      if (saved === "en" || saved === "ar") return saved;
    } catch {}
    return "en";
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (lang === "ar") {
      html.setAttribute("dir", "rtl");
      html.setAttribute("lang", "ar");
      body.classList.add("font-arabic");
    } else {
      html.setAttribute("dir", "ltr");
      html.setAttribute("lang", "en");
      body.classList.remove("font-arabic");
    }
    try {
      localStorage.setItem("greece-lang", lang);
    } catch {}
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  const t = (key: string): string => {
    const keys = key.split(".");
    return getNestedValue(
      translations[lang] as unknown as Record<string, unknown>,
      keys
    );
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t, isRTL: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
