import { nav } from "./nav";
import { auth } from "./auth";
import { common } from "./common";
import { home } from "./home";
import { collection } from "./collection";
import { cart } from "./cart";
import { faq } from "./faq";
import { contact } from "./contact";
import { pages } from "./pages";
import { footer } from "./footer";
import { products } from "./products";

export const translations = {
  en: {
    nav: nav.en,
    auth: auth.en,
    common: common.en,
    home: home.en,
    collection: collection.en,
    cart: cart.en,
    faq: faq.en,
    contact: contact.en,
    pages: pages.en,
    footer: footer.en,
    products: products.en,
  },
  ar: {
    nav: nav.ar,
    auth: auth.ar,
    common: common.ar,
    home: home.ar,
    collection: collection.ar,
    cart: cart.ar,
    faq: faq.ar,
    contact: contact.ar,
    pages: pages.ar,
    footer: footer.ar,
    products: products.ar,
  },
} as const;

export type TranslationsType = typeof translations;
export type Lang = keyof TranslationsType;
