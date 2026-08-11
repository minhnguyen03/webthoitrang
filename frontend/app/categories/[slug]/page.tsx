import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryBySlug, getProducts } from "@/lib/api";
import { itemListJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const title = category ? `${category.name} | Fashion Shop` : "Bộ sưu tập thời trang";
  const description = category?.description || "Duyệt bộ sưu tập Fashion Shop được tuyển chọn theo phong cách.";

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/categories/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/categories/${slug}`),
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const products = await getProducts({ categoryId: category?.id, size: 12 });

  return (
    <>
      <JsonLd data={itemListJsonLd(products.content, `/categories/${slug}`)} />
      <header className="pageHeader">
        <div className="container">
          <p className="eyebrow">Bộ sưu tập</p>
          <h1>{category?.name || "Bộ sưu tập thời trang"}</h1>
          <p>{category?.description || "Khám phá các thiết kế quần áo được tuyển chọn."}</p>
          <div className="heroActions">
            <Link className="button" href={`/products${category ? `?categoryId=${category.id}` : ""}`}>
              Lọc trong cửa hàng <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="bandCompact">
        <div className="container">
          {products.content.length ? (
            <div className="productGrid">
              {products.content.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div>
                <h2>Chưa có sản phẩm trong bộ sưu tập này.</h2>
                <p>Quay lại cửa hàng để xem thêm các lựa chọn đang có sẵn.</p>
                <Link className="button" href="/products">
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
