"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Star } from "lucide-react";
import type { Product } from "@/lib/api";
import { getActiveVariants, getCompareAtPrice, getPriceLabel, getProductImage } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const compareAt = getCompareAtPrice(product);
  const variants = getActiveVariants(product);
  const totalStock = variants.reduce((total, variant) => total + Number(variant.stock || 0), 0);
  const hasStock = totalStock > 0;

  return (
    <article className="productCard">
      <Link className="productImageLink" href={`/products/${product.slug}`} aria-label={`Xem ${product.name}`}>
        <Image
          src={getProductImage(product)}
          alt={product.images?.[0]?.altText || product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 25vw"
          priority={priority}
        />
        {compareAt ? <span className="productBadge">SALE</span> : null}
      </Link>

      <div className="productBody">
        <div className="productMeta">{product.brand?.name || product.categories?.[0]?.name || "Fashion Shop"}</div>
        <Link className="productTitle" href={`/products/${product.slug}`}>
          {product.name}
        </Link>
        <div className="productFooter">
          <div>
            <span className="price">{getPriceLabel(product)}</span>
            {compareAt ? <span className="comparePrice">{compareAt}</span> : null}
            <div className={hasStock ? "stockText stockOk" : "stockText stockOut"}>
              {hasStock ? `Còn hàng (${totalStock})` : "Hết hàng"}
            </div>
          </div>
          <Link className="iconButton productQuickLink" href={`/products/${product.slug}`} title={`Xem ${product.name}`}>
            {product.averageRating ? (
              <span className="rating">
                <Star size={15} fill="currentColor" aria-hidden="true" />
                {product.averageRating.toFixed(1)}
              </span>
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}
