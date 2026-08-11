import type { Product, ProductVariant } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/api";

export function formatMoney(value?: number | string | null) {
  const numeric = Number(value || 0);

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function getActiveVariants(product: Product) {
  return (product.variants || []).filter((variant) => variant.isActive !== false);
}

export function getPrimaryVariant(product: Product): ProductVariant | undefined {
  const variants = getActiveVariants(product);
  return variants[0] || product.variants?.[0];
}

export function getProductImage(product: Product, index = 0) {
  const sorted = [...(product.images || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return resolveAssetUrl(sorted[index]?.url || sorted[0]?.url);
}

export function getPriceLabel(product: Product) {
  const prices = getActiveVariants(product)
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (!prices.length) {
    return "Liên hệ";
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return min === max ? formatMoney(min) : `${formatMoney(min)} - ${formatMoney(max)}`;
}

export function getCompareAtPrice(product: Product) {
  const variant = getPrimaryVariant(product);
  const compareAt = Number(variant?.compareAtPrice || 0);
  return compareAt > 0 ? formatMoney(compareAt) : null;
}

export function productSummary(product: Product) {
  return (
    product.description ||
    `${product.name} từ ${product.brand?.name || "Fashion Shop"}, được chọn cho tủ đồ hiện đại.`
  );
}
