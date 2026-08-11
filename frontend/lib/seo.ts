import type { Product } from "@/lib/api";
import { getPrimaryVariant, getProductImage, productSummary } from "@/lib/format";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/products")}?keyword={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function itemListJsonLd(products: Product[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
      image: getProductImage(product),
    })),
  };
}

export function productJsonLd(product: Product) {
  const variant = getPrimaryVariant(product);
  const price = Number(variant?.price || 0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productSummary(product),
    image: [getProductImage(product)],
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,
    sku: variant?.sku,
    aggregateRating: product.averageRating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.averageRating,
          reviewCount: product.totalReviews || 1,
        }
      : undefined,
    offers: price
      ? {
          "@type": "Offer",
          url: absoluteUrl(`/products/${product.slug}`),
          priceCurrency: "VND",
          price,
          availability: (variant?.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        }
      : undefined,
  };
}
