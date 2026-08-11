import type { Metadata } from "next";
import { CatalogClient } from "@/components/CatalogClient";
import { JsonLd } from "@/components/JsonLd";
import { getBrandsResult, getProductsResult, getStorefrontCategoriesResult, type ProductQuery } from "@/lib/api";
import { pickStorefrontCategories } from "@/lib/categories";
import { itemListJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type SearchParams = Record<string, string | string[] | undefined>;

function value(params: SearchParams, key: string) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

function buildQuery(params: SearchParams): ProductQuery {
  const pageNumber = Number(value(params, "page") || 0);
  const categoryId = value(params, "categoryId");
  const brandId = value(params, "brandId");
  const sortDirection = value(params, "sortDirection") === "ASC" ? "ASC" : "DESC";

  return {
    page: Number.isFinite(pageNumber) ? pageNumber : 0,
    size: 12,
    keyword: value(params, "keyword") || undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    brandId: brandId ? Number(brandId) : undefined,
    sortBy: value(params, "sortBy") || "id",
    sortDirection,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const keyword = value(params, "keyword");
  const title = keyword ? `Tìm kiếm: ${keyword}` : "Sản phẩm thời trang";
  const description = keyword
    ? `Duyệt các sản phẩm Fashion Shop phù hợp với từ khóa ${keyword}.`
    : "Duyệt bộ sưu tập Fashion Shop với tìm kiếm, bộ lọc danh mục và thương hiệu.";

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl("/products"),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/products"),
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = searchParams ? await searchParams : {};
  const query = buildQuery(params);
  const [categoriesResult, brandsResult, productsResult] = await Promise.all([
    getStorefrontCategoriesResult(),
    getBrandsResult(),
    getProductsResult(query),
  ]);
  const storefrontCategories = pickStorefrontCategories(categoriesResult.data, true);

  return (
    <>
      <JsonLd data={itemListJsonLd(productsResult.data.content, "/products")} />
      <CatalogClient
        initialProducts={productsResult.data}
        initialCategories={storefrontCategories}
        initialBrands={brandsResult.data}
        initialQuery={query}
        initialApiOk={productsResult.ok}
      />
    </>
  );
}
