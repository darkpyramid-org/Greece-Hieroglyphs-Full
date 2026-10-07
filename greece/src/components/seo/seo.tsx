import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SITE_NAME = "GREECE";
const SITE_URL = "https://www.darkpyramid.net";
const DEFAULT_OG_IMAGE = "/opengraph.jpg";

function setMeta(attr: string, val: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${val}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, val);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function injectJsonLd(data: object | object[], id: string) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(Array.isArray(data) ? data : data);
  document.head.appendChild(script);
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    /**
     * Merge with (never replace) the richer `robots` directive shipped in
     * `index.html` — this used to clobber `max-image-preview:large`,
     * `max-snippet` and `max-video-preview:large` on the very first render.
     */
    setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );
    if (keywords) setMeta("name", "keywords", keywords);

    const resolvedImage = ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`;
    const resolvedCanonical = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${SITE_URL}${canonical}`
      : undefined;

    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", resolvedImage);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    if (resolvedCanonical) setMeta("property", "og:url", resolvedCanonical);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", resolvedImage);
    setMeta("name", "twitter:site", "@greece-hieroglyphs.com");

    if (resolvedCanonical) setLink("canonical", resolvedCanonical);

    if (jsonLd) {
      injectJsonLd(jsonLd, "greece-jsonld");
    }

    return () => {
      const el = document.getElementById("greece-jsonld");
      if (el) el.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex]);

  return null;
}
