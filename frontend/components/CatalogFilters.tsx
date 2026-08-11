import { Search, SlidersHorizontal } from "lucide-react";
import type { Brand, Category } from "@/lib/api";

type CatalogFiltersProps = {
  categories: Category[];
  brands: Brand[];
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  sortBy?: string;
};

export function CatalogFilters({ categories, brands, keyword, categoryId, brandId, sortBy }: CatalogFiltersProps) {
  return (
    <form className="filterPanel" action="/products">
      <p className="eyebrow">
        <SlidersHorizontal size={14} aria-hidden="true" /> Filter edit
      </p>
      <label>
        Search
        <input type="search" name="keyword" defaultValue={keyword} placeholder="Blazer, dress, shirt" />
      </label>
      <label>
        Category
        <select name="categoryId" defaultValue={categoryId || ""}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Brand
        <select name="brandId" defaultValue={brandId || ""}>
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select name="sortBy" defaultValue={sortBy || "id"}>
          <option value="id">Newest</option>
          <option value="name">Name</option>
        </select>
      </label>
      <button className="button" type="submit">
        <Search size={17} aria-hidden="true" />
        Apply
      </button>
    </form>
  );
}
