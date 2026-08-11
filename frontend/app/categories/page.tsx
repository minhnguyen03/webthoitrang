import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryTiles } from "@/components/CategoryTiles";
import { getStorefrontCategories } from "@/lib/api";
import { pickStorefrontCategories } from "@/lib/categories";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Danh mục quần áo | Fashion Shop",
  description: "Khám phá áo sơ mi, chân váy và set bộ thời trang tại Fashion Shop.",
  alternates: {
    canonical: absoluteUrl("/categories"),
  },
};

export default async function CategoriesPage() {
  const apiCategories = await getStorefrontCategories();
  const categories = pickStorefrontCategories(apiCategories);

  return (
    <>
      <header className="pageHeader">
        <div className="container">
          <p className="eyebrow">Danh mục</p>
          <h1>Quần áo thời trang</h1>
          <p>Chọn danh mục phù hợp: áo sơ mi, chân váy hoặc set bộ phối sẵn.</p>
          <div className="heroActions">
            <Link className="button" href="/products">
              Xem tất cả sản phẩm <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="section sectionSoft">
        <div className="container">
          <CategoryTiles categories={categories} linkToCategoryPage />
        </div>
      </section>
    </>
  );
}
