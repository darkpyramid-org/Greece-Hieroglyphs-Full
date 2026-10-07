import { Link } from "wouter";
import { Eye, MapPin, Mail, Clock } from "lucide-react";
import { useLang } from "@/contexts/lang-context";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();

  const COLLECTION_LINKS = [
    { labelKey: "footer.links.hoodies", href: "/collection?category=Hoodies" },
    { labelKey: "footer.links.tshirts", href: "/collection?category=T-Shirts" },
    { labelKey: "footer.links.jackets", href: "/collection?category=Jackets" },
    { labelKey: "footer.links.bottoms", href: "/collection?category=Bottoms" },
    { labelKey: "footer.links.accessories", href: "/collection?category=Accessories" },
  ];

  const SUPPORT_LINKS = [
    { labelKey: "footer.links.sizeGuide", href: "/size-guide" },
    { labelKey: "footer.links.shippingReturns", href: "/shipping" },
    { labelKey: "footer.links.faqs", href: "/faq" },
    { labelKey: "footer.links.contactUs", href: "/contact" },
    { labelKey: "footer.links.trackOrder", href: "/track-order" },
  ];

  const DISCOVER_LINKS = [
    { labelKey: "footer.links.ourStory", href: "/story" },
    { labelKey: "footer.links.egyptianCulture", href: "/culture" },
    { labelKey: "footer.links.theCollection", href: "/collection" },
    { labelKey: "footer.links.community", href: "/community" },
    { labelKey: "footer.links.careers", href: "/careers" },
  ];

  return (
    <footer className="bg-[#1B1B1B] dark:bg-[#0D0B09] text-[#FDF8EF]">
      <div className="border-b border-[#FDF8EF]/8 py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Eye className="h-7 w-7 text-[#C89D29] transition-transform group-hover:scale-110" />
              <span className="text-xl font-black hieroglyph-font text-[#FDF8EF]">GREECE</span>
            </Link>
            <p className="text-[#FDF8EF]/55 text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2 text-xs text-[#FDF8EF]/40">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#C89D29] shrink-0" />
                <span>{t("footer.location")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#C89D29] shrink-0" />
                <a href="mailto:darkpyramid.solutions@gmail.com" className="hover:text-[#C89D29] transition-colors">
                  darkpyramid.solutions@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#C89D29] shrink-0" />
                <span>{t("footer.hours")}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="hieroglyph-font text-xs text-[#C89D29] mb-5 tracking-widest">{t("footer.collectionTitle")}</h4>
            <ul className="space-y-3">
              {COLLECTION_LINKS.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-[#FDF8EF]/55 hover:text-[#C89D29] transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#C89D29]/30 group-hover:bg-[#C89D29] transition-colors" />
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="hieroglyph-font text-xs text-[#C89D29] mb-5 tracking-widest">{t("footer.supportTitle")}</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-[#FDF8EF]/55 hover:text-[#C89D29] transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#C89D29]/30 group-hover:bg-[#C89D29] transition-colors" />
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="hieroglyph-font text-xs text-[#C89D29] mb-5 tracking-widest">{t("footer.discoverTitle")}</h4>
            <ul className="space-y-3">
              {DISCOVER_LINKS.map((l) => (
                <li key={l.labelKey}>
                  <Link href={l.href} className="text-[#FDF8EF]/55 hover:text-[#C89D29] transition-colors text-sm flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-[#C89D29]/30 group-hover:bg-[#C89D29] transition-colors" />
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-5">
            {["𓂀", "𓅃", "𓋹", "𓊖"].map((g, i) => (
              <span key={i} className="text-[#C89D29]/50 text-2xl hover:text-[#C89D29] transition-colors cursor-default select-none">
                {g}
              </span>
            ))}
          </div>
          <p className="text-[#FDF8EF]/30 text-xs text-center">
            © {year} {t("footer.copyright")}
          </p>
          <p className="text-[#FDF8EF]/20 text-xs text-center">
            {t("footer.payments")}
          </p>
        </div>
      </div>
    </footer>
  );
}
