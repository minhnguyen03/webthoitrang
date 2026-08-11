import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailExperience } from "@/components/ProductDetailExperience";
import { getProductBySlug, getProducts } from "@/lib/api";
import { getProductImage, productSummary } from "@/lib/format";
import { productJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm",
      robots: {
        index: false,
      },
    };
  }

  const description = productSummary(product);
  const image = getProductImage(product);

  return {
    title: product.name,
    description,
    alternates: {
      canonical: absoluteUrl(`/products/${product.slug}`),
    },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: absoluteUrl(`/products/${product.slug}`),
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = product.categories?.[0]
    ? await getProducts({ categoryId: product.categories[0].id, size: 4 })
    : await getProducts({ size: 4 });
  const relatedProducts = related.content.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <div className="container">
        <div className="bandCompact">
          <Link className="ghostButton" href="/products">
            <ArrowLeft size={16} aria-hidden="true" />
            Quay lại cửa hàng
          </Link>
        </div>

        <ProductDetailExperience product={product} />
      </div>

      {relatedProducts.length ? (
        <section className="bandCompact">
          <div className="container">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">Gợi ý thêm</p>
                <h2>Hoàn thiện phong cách.</h2>
              </div>
            </div>
            <div className="productGrid">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
