const SITE_URL = "https://verywill.store";

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  jsonLd?: object | object[];
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GREECE",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: "Egyptian Streetwear brand born in Cairo — pharaonic heritage meets modern street rebellion.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  sameAs: [
    "https://instagram.com/verywill_store",
    "https://tiktok.com/@verywill_store",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GREECE",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/collection?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbHome = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  ],
};

export const SEO_DATA: Record<string, PageSEO> = {
  home: {
    title: "GREECE — Egyptian Streetwear | Ancient Power, Modern Form",
    description:
      "Shop GREECE Egyptian streetwear — premium hoodies, tees & jackets inspired by pharaonic heritage. Iconic Egyptian symbols meet modern street fashion. Cairo-born, world-worn.",
    keywords:
      "Egyptian streetwear, pharaoh fashion, Egyptian clothing, Cairo street fashion, GREECE, Egyptian hoodie, pharaonic symbols, Egyptian tee shirt, ankh clothing, Eye of Horus fashion, Egyptian urban wear, premium Egyptian apparel",
    canonical: "/",
    jsonLd: [organizationSchema, websiteSchema],
  },

  collection: {
    title: "Sacred Collection — Egyptian Streetwear | GREECE",
    description:
      "Browse GREECE's full collection of Egyptian streetwear. Premium hoodies, T-shirts, jackets and accessories featuring authentic pharaonic symbols — Ankh, Eye of Horus, Scarab. Shop now.",
    keywords:
      "Egyptian streetwear collection, pharaoh hoodie, Egyptian graphic tee, GREECE collection, Egyptian clothing Cairo, ancient Egyptian fashion, pharaonic streetwear, Egyptian skull hoodie, Ankh tee, Horus jacket",
    canonical: "/collection",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "GREECE Sacred Collection",
      description: "Premium Egyptian streetwear inspired by pharaonic heritage.",
      url: `${SITE_URL}/collection`,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Collection", item: `${SITE_URL}/collection` },
        ],
      },
    },
  },

  story: {
    title: "Our Story — Egyptian Streetwear Brand | GREECE",
    description:
      "How GREECE was born from Cairo's streets, inspired by 5,000 years of pharaonic heritage. Meet the brand redefining Egyptian identity in modern fashion. Made in Egypt.",
    keywords:
      "GREECE story, Egyptian fashion brand Cairo, Egyptian streetwear history, pharaoh fashion brand, made in Egypt clothing, Egyptian cultural fashion, Cairo fashion designers",
    canonical: "/story",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "GREECE — Our Story",
      url: `${SITE_URL}/story`,
      description: "The story of how GREECE was born from Cairo, inspired by 5,000 years of pharaonic heritage.",
    },
  },

  culture: {
    title: "Egyptian Culture & Ancient Symbols | GREECE Streetwear",
    description:
      "Discover the ancient Egyptian symbols behind GREECE's designs — the Ankh (eternal life), Eye of Horus (protection), Scarab (rebirth), and the gods of ancient Egypt. Fashion rooted in real history.",
    keywords:
      "Egyptian symbols meaning, Ankh symbol, Eye of Horus, Scarab Egypt, ancient Egyptian gods, pharaoh symbols, Egyptian hieroglyphs meaning, Horus falcon, Ra sun god, Egyptian culture fashion",
    canonical: "/culture",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      name: "Egyptian Culture & Ancient Symbols",
      headline: "5,000 Years of Egyptian Symbols — The Culture Behind GREECE",
      url: `${SITE_URL}/culture`,
      publisher: {
        "@type": "Organization",
        name: "GREECE",
        logo: `${SITE_URL}/favicon.svg`,
      },
    },
  },

  community: {
    title: "The Movement — 10,000+ Modern Pharaohs | GREECE",
    description:
      "Join 10,000+ modern pharaohs wearing GREECE across Egypt and the Arab world. Read authentic reviews and become part of Egypt's most powerful cultural streetwear community.",
    keywords:
      "GREECE community, Egyptian streetwear community, modern pharaohs, Egyptian fashion lovers, GREECE reviews, Cairo streetwear culture, Egyptian urban movement",
    canonical: "/community",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CommunityForum",
      name: "GREECE Community — Modern Pharaohs",
      url: `${SITE_URL}/community`,
    },
  },

  contact: {
    title: "Contact GREECE — Customer Support | Egyptian Streetwear",
    description:
      "Get in touch with GREECE. Customer support for orders, shipping, returns, and press inquiries. Based in Maadi, Cairo, Egypt. Reply within 24 hours.",
    keywords:
      "GREECE contact, Egyptian streetwear support, GREECE customer service, Cairo fashion contact, order support Egypt",
    canonical: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact GREECE",
      url: `${SITE_URL}/contact`,
      contactOption: "TollFree",
      areaServed: ["EG", "SA", "AE", "KW", "QA"],
      availableLanguage: ["English", "Arabic"],
    },
  },

  faq: {
    title: "FAQ — Shipping, Returns, Orders & Payments | GREECE",
    description:
      "Answers to common questions about GREECE: delivery times across Egypt, international shipping to Gulf countries, 14-day returns policy, accepted payment methods (Visa, Fawry, COD), and more.",
    keywords:
      "GREECE FAQ, Egyptian streetwear shipping, delivery Egypt, return policy Egypt, payment methods Egypt, Fawry payment, cash on delivery Egypt, shipping Gulf countries",
    canonical: "/faq",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What payment methods do you accept?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We accept Visa, Mastercard, PayPal, Fawry, and cash on delivery within Egypt.",
          },
        },
        {
          "@type": "Question",
          name: "How long does delivery take within Egypt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cairo/Giza: 2–3 business days. Other governorates: 4–6 business days.",
          },
        },
        {
          "@type": "Question",
          name: "Do you ship internationally?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we ship to Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, and Jordan. Orders take 7–14 business days.",
          },
        },
        {
          "@type": "Question",
          name: "What is your return policy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Returns accepted within 14 days of delivery for unworn, unwashed items with original tags attached.",
          },
        },
      ],
    },
  },

  shipping: {
    title: "Shipping & Returns Policy | GREECE Egyptian Streetwear",
    description:
      "Free shipping on orders above EGP 1,500 within Egypt. Delivery to Cairo in 2–3 days, nationwide 4–6 days. International shipping to Gulf. Easy 14-day returns.",
    keywords:
      "GREECE shipping, free shipping Egypt, Egyptian streetwear delivery, return policy Egypt, international shipping Egypt, Gulf shipping fashion",
    canonical: "/shipping",
    jsonLd: breadcrumbHome,
  },

  sizeGuide: {
    title: "Size Guide — Find Your Perfect Fit | GREECE",
    description:
      "Use GREECE's detailed size guide to find your perfect fit in hoodies, T-shirts, and jackets. Measurements in both centimeters and inches.",
    keywords:
      "GREECE size guide, Egyptian streetwear sizing, hoodie size chart, tee size guide, Egyptian clothing sizes, streetwear measurements",
    canonical: "/size-guide",
  },

  careers: {
    title: "Careers at GREECE — Join the Egyptian Streetwear Revolution",
    description:
      "Work with GREECE in Cairo. Join a passionate team building Egypt's future in streetwear. Open positions in design, marketing, and operations.",
    keywords:
      "GREECE careers, jobs Cairo fashion, Egyptian fashion designer job, streetwear brand careers Cairo, fashion marketing Egypt",
    canonical: "/careers",
  },

  cart: {
    title: "Your Cart — GREECE Egyptian Streetwear",
    description:
      "Review your GREECE cart and proceed to secure checkout. Egyptian streetwear shipped across Egypt and the Arab world.",
    keywords: "GREECE cart, checkout Egyptian streetwear, buy Egyptian fashion",
    canonical: "/cart",
    noindex: true,
  } as PageSEO & { noindex: boolean },

  trackOrder: {
    title: "Track Your Order — GREECE",
    description:
      "Track your GREECE order status in real time. Enter your order ID and email address for live delivery updates.",
    keywords: "track GREECE order, Egyptian streetwear order tracking, order status Egypt",
    canonical: "/track-order",
    noindex: true,
  } as PageSEO & { noindex: boolean },

  checkoutSuccess: {
    title: "Order Confirmed — GREECE",
    description: "Your GREECE order has been confirmed. Thank you for supporting Egyptian streetwear culture.",
    keywords: "GREECE order confirmed",
    canonical: "/checkout/success",
    noindex: true,
  } as PageSEO & { noindex: boolean },

  notFound: {
    title: "Page Not Found — GREECE",
    description: "The page you're looking for doesn't exist. Explore GREECE's Egyptian streetwear collection instead.",
    keywords: "GREECE 404",
    canonical: "/404",
    noindex: true,
  } as PageSEO & { noindex: boolean },
};

export function getProductSEO(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  badge?: string;
  category?: string;
}): PageSEO {
  const image = product.images?.[0] ?? "/opengraph.jpg";
  return {
    title: `${product.name} — Egyptian Streetwear | GREECE`,
    description: `${product.description} Premium Egyptian streetwear piece by GREECE. Inspired by pharaonic heritage, crafted in Cairo.`,
    keywords: `${product.name}, GREECE, Egyptian streetwear, pharaoh fashion, ${product.category ?? "Egyptian clothing"}, Egyptian ${product.category ?? "apparel"} Cairo`,
    canonical: `/product/${product.id}`,
    ogImage: image,
    ogType: "product",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: image.startsWith("http") ? image : `${SITE_URL}${image}`,
      url: `${SITE_URL}/product/${product.id}`,
      brand: { "@type": "Brand", name: "GREECE" },
      offers: {
        "@type": "Offer",
        // `product.price` is in cents (EGP minor units); schema.org expects the major unit.
        price: product.price / 100,
        priceCurrency: "EGP",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "GREECE" },
      },
    },
  };
}
