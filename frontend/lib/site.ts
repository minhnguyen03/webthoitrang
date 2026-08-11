export const siteConfig = {
  name: "Elimaz Shop",
  description:
    "Elimaz Shop là không gian mua sắm thời trang công sở cho nữ, với bộ sưu tập dễ khám phá và trải nghiệm đặt hàng gọn gàng.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiBaseUrl:
    process.env.FASHION_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  publicApiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  heroImage:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2200&q=86",
  storyImage:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=86",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
