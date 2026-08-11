import { siteConfig } from "@/lib/site";
import { categoryImageForSlug } from "@/lib/categories";

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  parentName?: string | null;
  childrenCount?: number;
};

export type Color = {
  id: number;
  name: string;
  code?: string | null;
};

export type Size = {
  id: number;
  name: string;
  code?: string | null;
};

export type ProductVariant = {
  id: number;
  sku: string;
  color?: Color | null;
  size?: Size | null;
  price: number | string;
  compareAtPrice?: number | string | null;
  stock?: number | null;
  isActive?: boolean | null;
};

export type ProductImage = {
  id: number;
  url: string;
  altText?: string | null;
  sortOrder?: number | null;
  variantId?: number | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  material?: string | null;
  origin?: string | null;
  isActive?: boolean | null;
  brand?: Brand | null;
  categories?: Category[];
  variants?: ProductVariant[];
  images?: ProductImage[];
  averageRating?: number | null;
  totalReviews?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type ProductQuery = {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  brandId?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
};

export type ApiResult<T> = {
  data: T;
  ok: boolean;
  status?: number;
  error?: string;
};

export const emptyProductPage: Page<Product> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 12,
};

export { clothingCategoryDefinitions, pickStorefrontCategories } from "@/lib/categories";

function getApiUrl(path: string) {
  return `${siteConfig.apiBaseUrl}${path}`;
}

function emptyPage(page = 0, size = 12): Page<Product> {
  return {
    ...emptyProductPage,
    number: page,
    size,
  };
}

async function apiFetchResult<T>(path: string, fallback: T, revalidate = 120): Promise<ApiResult<T>> {
  try {
    const response = await fetch(getApiUrl(path), {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    if (!response.ok) {
      return {
        data: fallback,
        ok: false,
        status: response.status,
        error: `Backend API returned ${response.status}`,
      };
    }

    return {
      data: (await response.json()) as T,
      ok: true,
      status: response.status,
    };
  } catch (error) {
    return {
      data: fallback,
      ok: false,
      error: error instanceof Error ? error.message : "Cannot connect to backend API",
    };
  }
}

export function productQueryPath(query: ProductQuery = {}) {
  const page = query.page ?? 0;
  const size = query.size ?? 12;
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (query.keyword) {
    params.set("keyword", query.keyword);
    return `/api/products/search?${params.toString()}`;
  }

  if (query.categoryId) {
    return `/api/products/category/${query.categoryId}?${params.toString()}`;
  }

  if (query.brandId) {
    return `/api/products/brand/${query.brandId}?${params.toString()}`;
  }

  params.set("sortBy", query.sortBy || "id");
  params.set("sortDirection", query.sortDirection || "DESC");
  return `/api/products?${params.toString()}`;
}

export async function getProductsResult(query: ProductQuery = {}) {
  const page = query.page ?? 0;
  const size = query.size ?? 12;
  return apiFetchResult<Page<Product>>(productQueryPath(query), emptyPage(page, size));
}

export async function getProducts(query: ProductQuery = {}) {
  const result = await getProductsResult(query);
  return result.data;
}

export async function getFeaturedProducts(limit = 6) {
  const result = await getProductsResult({ page: 0, size: limit, sortBy: "id", sortDirection: "DESC" });
  return result.data.content.slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  const result = await apiFetchResult<Product | null>(`/api/products/slug/${slug}`, null, 60);
  return result.data;
}

export async function getCategoriesResult() {
  return apiFetchResult<Category[]>("/api/categories", [], 300);
}

export async function getCategories() {
  const result = await getCategoriesResult();
  return result.data;
}

export async function getRootCategories() {
  const result = await apiFetchResult<Category[]>("/api/categories/root", [], 300);
  return result.data;
}

export async function getStorefrontCategoriesResult() {
  return apiFetchResult<Category[]>("/api/categories/storefront", [], 300);
}

export async function getStorefrontCategories() {
  const result = await getStorefrontCategoriesResult();
  return result.data;
}

export async function getCategoryBySlug(slug: string) {
  const result = await apiFetchResult<Category | null>(`/api/categories/slug/${slug}`, null, 300);
  return result.data;
}

export async function getBrandsResult() {
  return apiFetchResult<Brand[]>("/api/brands", [], 300);
}

export async function getBrands() {
  const result = await getBrandsResult();
  return result.data;
}

export async function getBackendStatus() {
  const result = await apiFetchResult<Page<Product>>("/api/products?page=0&size=1&sortBy=id&sortDirection=DESC", emptyPage(0, 1), 30);
  return {
    ok: result.ok,
    status: result.status,
    error: result.error,
    baseUrl: siteConfig.apiBaseUrl,
  };
}

export function resolveAssetUrl(url?: string | null) {
  if (!url) {
    return "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=84";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const normalizedUrl = url.startsWith("/") ? url.slice(1) : url;
  return `/backend-assets/${normalizedUrl}`;
}

export function categoryImage(category: Category, index = 0) {
  return categoryImageForSlug(category.slug, index);
}
