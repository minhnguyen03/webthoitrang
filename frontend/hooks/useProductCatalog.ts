"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Brand, Category, Page, Product, ProductQuery } from "@/lib/api";
import { emptyProductPage, productQueryPath } from "@/lib/api";
import { pickStorefrontCategories } from "@/lib/categories";

type UseProductCatalogOptions = {
  initialProducts: Page<Product>;
  initialCategories: Category[];
  initialBrands: Brand[];
  initialQuery: ProductQuery;
  initialApiOk: boolean;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Không thể tải dữ liệu cửa hàng");
  }

  return (await response.json()) as T;
}

function normalizeQuery(query: ProductQuery): ProductQuery {
  return {
    page: query.page ?? 0,
    size: query.size ?? 12,
    keyword: query.keyword || "",
    categoryId: query.categoryId,
    brandId: query.brandId,
    sortBy: query.sortBy || "id",
    sortDirection: query.sortDirection || "DESC",
  };
}

export function useProductCatalog({
  initialProducts,
  initialCategories,
  initialBrands,
  initialQuery,
  initialApiOk,
}: UseProductCatalogOptions) {
  const requestIdRef = useRef(0);
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Page<Product>>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [query, setQuery] = useState<ProductQuery>(() => normalizeQuery(initialQuery));
  const [loading, setLoading] = useState(false);
  const [apiOk, setApiOk] = useState(initialApiOk);
  const [error, setError] = useState<string | null>(initialApiOk ? null : "Cửa hàng đang cập nhật dữ liệu");

  const activeFilters = useMemo(() => {
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
    const brandNames = new Map(brands.map((brand) => [brand.id, brand.name]));
    const filters: string[] = [];

    if (query.keyword) filters.push(`Từ khóa: "${query.keyword}"`);
    if (query.categoryId) filters.push(`Danh mục: ${categoryNames.get(query.categoryId) || query.categoryId}`);
    if (query.brandId) filters.push(`Thương hiệu: ${brandNames.get(query.brandId) || query.brandId}`);

    return filters;
  }, [brands, categories, query.brandId, query.categoryId, query.keyword]);

  const loadFilters = useCallback(async () => {
    try {
      const [categoryData, brandData] = await Promise.all([
        fetchJson<Category[]>("/api/categories/storefront"),
        fetchJson<Brand[]>("/api/brands"),
      ]);
      setCategories(pickStorefrontCategories(categoryData, true));
      setBrands(brandData);
    } catch {
      setApiOk(false);
    }
  }, []);

  const loadProducts = useCallback(async (nextQuery: ProductQuery) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);
    setError(null);

    try {
      const normalizedQuery = normalizeQuery(nextQuery);
      const data = await fetchJson<Page<Product>>(productQueryPath(normalizedQuery));
      if (requestIdRef.current !== requestId) return;

      startTransition(() => {
        setProducts(data);
        setQuery(normalizedQuery);
        setApiOk(true);
      });
    } catch {
      if (requestIdRef.current !== requestId) return;

      startTransition(() => {
        setProducts(emptyProductPage);
        setQuery(normalizeQuery(nextQuery));
        setApiOk(false);
        setError("Không thể tải dữ liệu cửa hàng");
      });
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!initialCategories.length || !initialBrands.length) {
      void loadFilters();
    }
  }, [initialBrands.length, initialCategories.length, loadFilters]);

  return {
    products,
    categories,
    brands,
    query,
    loading: loading || isPending,
    apiOk,
    error,
    activeFilters,
    loadProducts,
  };
}
