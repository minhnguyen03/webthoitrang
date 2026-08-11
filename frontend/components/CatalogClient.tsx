"use client";

import { FormEvent } from "react";
import { LoaderCircle, Search, Sparkles, XCircle } from "lucide-react";
import type { Brand, Category, Page, Product, ProductQuery } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useProductCatalog } from "@/hooks/useProductCatalog";

type CatalogClientProps = {
  initialProducts: Page<Product>;
  initialCategories: Category[];
  initialBrands: Brand[];
  initialQuery: ProductQuery;
  initialApiOk: boolean;
};

const popularTags = ["áo sơ mi", "chân váy", "set bộ"];

export function CatalogClient({
  initialProducts,
  initialCategories,
  initialBrands,
  initialQuery,
  initialApiOk,
}: CatalogClientProps) {
  const { products, categories, brands, query, loading, apiOk, error, activeFilters, loadProducts } = useProductCatalog({
    initialProducts,
    initialCategories,
    initialBrands,
    initialQuery,
    initialApiOk,
  });

  const formKey = `${query.keyword || ""}-${query.categoryId || ""}-${query.brandId || ""}-${query.sortBy || "id"}-${
    query.sortDirection || "DESC"
  }`;

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const sortValue = String(form.get("sort") || "id-DESC").split("-");
    const nextQuery: ProductQuery = {
      page: 0,
      size: 12,
      keyword: String(form.get("keyword") || "").trim(),
      categoryId: form.get("categoryId") ? Number(form.get("categoryId")) : undefined,
      brandId: form.get("brandId") ? Number(form.get("brandId")) : undefined,
      sortBy: sortValue[0] || "id",
      sortDirection: sortValue[1] === "ASC" ? "ASC" : "DESC",
    };
    void loadProducts(nextQuery);
  }

  function quickSearch(keyword: string) {
    void loadProducts({
      ...query,
      page: 0,
      keyword,
      categoryId: undefined,
      brandId: undefined,
    });
  }

  function resetFilters() {
    void loadProducts({
      page: 0,
      size: 12,
      sortBy: "id",
      sortDirection: "DESC",
    });
  }

  function gotoPage(page: number) {
    void loadProducts({
      ...query,
      page,
    });
  }

  return (
    <>
      <section className="searchHeader">
        <div className="container">
          <p className="eyebrow">Cửa hàng</p>
          <h1>Tìm món hợp với phong cách của bạn</h1>
          <p>Khám phá các thiết kế mới, lọc nhanh theo danh mục, thương hiệu và sắp xếp theo nhu cầu mua sắm.</p>

          <form className="searchBox" onSubmit={submitFilters} key={`search-${formKey}`}>
            <input
              type="search"
              name="keyword"
              defaultValue={query.keyword}
              placeholder="Tìm kiếm theo tên, mô tả, thương hiệu..."
              aria-label="Tìm kiếm sản phẩm"
            />
            <button type="submit" title="Tìm kiếm">
              <Search size={18} aria-hidden="true" />
            </button>
          </form>

          <div className="searchTags" aria-label="Tìm kiếm phổ biến">
            <small>Tìm kiếm phổ biến:</small>
            {popularTags.map((tag) => (
              <button key={tag} type="button" onClick={() => quickSearch(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container catalogShell">
        <form className="filterPanel" onSubmit={submitFilters} key={`filters-${formKey}`}>
          <h2>Bộ lọc</h2>
          <label>
            Tìm kiếm
            <input name="keyword" defaultValue={query.keyword} placeholder="Nhập từ khóa..." />
          </label>
          <label>
            Danh mục
            <select name="categoryId" defaultValue={query.categoryId || ""}>
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Thương hiệu
            <select name="brandId" defaultValue={query.brandId || ""}>
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option value={brand.id} key={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sắp xếp
            <select name="sort" defaultValue={`${query.sortBy || "id"}-${query.sortDirection || "DESC"}`}>
              <option value="id-DESC">Mới nhất</option>
              <option value="id-ASC">Cũ nhất</option>
              <option value="name-ASC">Tên A-Z</option>
              <option value="name-DESC">Tên Z-A</option>
            </select>
          </label>
          <div className="filterActions">
            <button className="button" type="submit">
              <Search size={16} aria-hidden="true" /> Áp dụng
            </button>
            <button className="ghostButton" type="button" onClick={resetFilters}>
              <XCircle size={16} aria-hidden="true" /> Xóa bộ lọc
            </button>
          </div>
        </form>

        <section>
          {activeFilters.length ? (
            <div className="activeFilters">
              {activeFilters.map((filter) => (
                <span className="filterBadge" key={filter}>
                  {filter}
                </span>
              ))}
            </div>
          ) : null}

          <div className="catalogToolbar">
            <div>
              <h2>Tất cả sản phẩm</h2>
              <span>
                {loading
                  ? "Đang cập nhật..."
                  : `Tìm thấy ${products.totalElements || 0} sản phẩm${
                      products.totalPages > 1 ? ` · Trang ${(products.number || 0) + 1}/${products.totalPages}` : ""
                    }`}
              </span>
            </div>
            <span className="statusChip" data-ok={String(apiOk)}>
              {apiOk ? "Sẵn sàng mua sắm" : "Đang cập nhật"}
            </span>
          </div>

          {loading ? (
            <div className="catalogInlineStatus" role="status">
              <LoaderCircle className="spinIcon" size={17} aria-hidden="true" />
              Đang làm mới lựa chọn phù hợp...
            </div>
          ) : null}

          {!apiOk && error ? (
            <div className="apiNotice">
              <div>
                <strong>Chưa tải được sản phẩm</strong>
                <p>{error}. Vui lòng thử lại sau ít phút hoặc làm mới trang.</p>
                <button className="button" type="button" onClick={() => void loadProducts(query)}>
                  <Sparkles size={16} aria-hidden="true" /> Thử lại
                </button>
              </div>
            </div>
          ) : loading && !products.content.length ? (
            <div className="catalogSkeletonGrid" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, index) => (
                <span className="catalogSkeletonCard" key={index} />
              ))}
            </div>
          ) : products.content.length ? (
            <>
              <div className="productGrid catalogProductGrid" data-loading={String(loading)}>
                {products.content.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
              {products.totalPages > 1 ? (
                <div className="pagination" aria-label="Phân trang sản phẩm">
                  {Array.from({ length: products.totalPages }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-current={index === products.number ? "page" : undefined}
                      onClick={() => gotoPage(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="emptyState">
              <div>
                <strong>Không tìm thấy sản phẩm</strong>
                <p>Thử từ khóa khác hoặc xóa bộ lọc để xem thêm lựa chọn trong cửa hàng.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
