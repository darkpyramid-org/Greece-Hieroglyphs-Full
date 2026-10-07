import { translations } from "@/i18n";
import type { Product } from "@/lib/types";
import type { Lang } from "@/i18n";

/**
 * Get translated product name and description
 */
export function getTranslatedProduct(product: Product, lang: Lang): { name: string; description: string } {
  const productTranslations = translations[lang].products;
  const productKey = product.slug || product.id;
  
  // Try to get translation by slug first, then by ID
  const translation = productTranslations[productKey as keyof typeof productTranslations];
  
  if (translation) {
    return {
      name: translation.name,
      description: translation.description,
    };
  }
  
  // Fallback to original product data if no translation found
  return {
    name: product.name,
    description: product.description,
  };
}

/**
 * Get all translated products
 */
export function getTranslatedProducts(products: Product[], lang: Lang): Product[] {
  return products.map(product => {
    const translated = getTranslatedProduct(product, lang);
    return {
      ...product,
      name: translated.name,
      description: translated.description,
    };
  });
}