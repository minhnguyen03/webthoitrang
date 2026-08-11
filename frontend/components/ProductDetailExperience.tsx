"use client";

import Image from "next/image";
import { ShieldCheck, Star, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { AddToCart } from "@/components/AddToCart";
import { ProductReviews } from "@/components/ProductReviews";
import type { Product, ProductImage, ProductVariant } from "@/lib/api";
import { formatMoney, getPriceLabel, getPrimaryVariant, getProductImage, productSummary } from "@/lib/format";

type ProductDetailExperienceProps = {
  product: Product;
};

function sortedImages(product: Product) {
  return [...(product.images || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

function imageSrc(product: Product, image?: ProductImage | null) {
  if (!image) return getProductImage(product);
  return getProductImage({ ...product, images: [image] });
}

function imagesForVariant(product: Product, variant?: ProductVariant) {
  const images = sortedImages(product);
  if (!images.length) return [];
  const exact = variant ? images.filter((image) => image.variantId === variant.id) : [];
  const general = images.filter((image) => !image.variantId);
  return exact.length ? [...exact, ...general] : images;
}

export function ProductDetailExperience({ product }: ProductDetailExperienceProps) {
  const firstVariant = getPrimaryVariant(product);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(firstVariant);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const galleryImages = useMemo(() => imagesForVariant(product, selectedVariant), [product, selectedVariant]);
  const activeImage = galleryImages.find((image) => image.id === selectedImageId) || galleryImages[0];
  const stock = selectedVariant?.stock ?? 0;
  const price = selectedVariant ? formatMoney(selectedVariant.price) : getPriceLabel(product);

  function handleVariantChange(variant: ProductVariant | undefined) {
    setSelectedVariant(variant);
    const nextImage = imagesForVariant(product, variant)[0];
    setSelectedImageId(nextImage?.id ?? null);
  }

  return (
    <>
      <section className="detailGrid">
        <div className="gallery" aria-label={`Bộ ảnh ${product.name}`}>
          <div className="galleryFrame galleryFrameMain">
            <Image src={imageSrc(product, activeImage)} alt={activeImage?.altText || product.name} fill sizes="(max-width: 980px) 100vw, 55vw" priority />
          </div>
          {galleryImages.slice(0, 6).map((image, index) => (
            <button
              className="galleryThumb"
              key={`${image.id}-${index}`}
              type="button"
              aria-pressed={(activeImage?.id || 0) === image.id}
              onClick={() => setSelectedImageId(image.id)}
            >
              <Image src={imageSrc(product, image)} alt={image.altText || `${product.name} ảnh ${index + 1}`} fill sizes="112px" />
            </button>
          ))}
        </div>

        <article className="detailPanel">
          <p className="eyebrow">{product.brand?.name || product.categories?.[0]?.name || "Fashion Shop"}</p>
          <h1>{product.name}</h1>
          <p className="detailLead">{productSummary(product)}</p>
          <div className="productFooter">
            <div>
              <span className="price">{price}</span>
              {selectedVariant?.compareAtPrice ? <span className="comparePrice">{formatMoney(selectedVariant.compareAtPrice)}</span> : null}
            </div>
            {product.averageRating ? (
              <span className="rating">
                <Star size={17} fill="currentColor" aria-hidden="true" />
                {product.averageRating.toFixed(1)} ({product.totalReviews || 0})
              </span>
            ) : null}
          </div>

          <div className="detailFacts">
            <div className="fact">
              <span>Chất liệu</span>
              <strong>{product.material || "Vải chọn lọc"}</strong>
            </div>
            <div className="fact">
              <span>Xuất xứ</span>
              <strong>{product.origin || "Fashion Shop"}</strong>
            </div>
            <div className="fact">
              <span>Tồn kho</span>
              <strong>{stock > 0 ? `Còn ${stock}` : "Liên hệ shop"}</strong>
            </div>
          </div>

          <AddToCart product={product} selectedVariantId={selectedVariant?.id} onVariantChange={handleVariantChange} />

          <div className="detailServiceList">
            <div>
              <Truck size={19} aria-hidden="true" />
              <strong>Mua sắm nhanh, thao tác gọn</strong>
              <span>Chọn đúng màu, kích cỡ, số lượng rồi thêm vào giỏ hoặc mua ngay.</span>
            </div>
            <div>
              <ShieldCheck size={19} aria-hidden="true" />
              <strong>Thông tin rõ ràng trước khi mua</strong>
              <span>Giá, tồn kho, chất liệu, ảnh theo phân loại và đánh giá được hiển thị trước khi đặt hàng.</span>
            </div>
          </div>
        </article>
      </section>

      <ProductReviews productId={product.id} averageRating={product.averageRating} totalReviews={product.totalReviews} />
    </>
  );
}
