import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/api";
import { categoryImage } from "@/lib/api";

type CategoryTilesProps = {
  categories?: Category[];
  tiles?: Array<{
    title: string;
    subtitle: string;
    href: string;
    image: string;
  }>;
  linkToCategoryPage?: boolean;
};

export function CategoryTiles({ categories = [], tiles, linkToCategoryPage = false }: CategoryTilesProps) {
  const items =
    tiles ||
    categories.map((category, index) => ({
      title: category.name,
      subtitle: category.description || "Khám phá bộ sưu tập mới",
      href: linkToCategoryPage
        ? `/categories/${category.slug}`
        : category.id
          ? `/products?categoryId=${category.id}`
          : `/products?keyword=${encodeURIComponent(category.name)}`,
      image: categoryImage(category, index),
    }));

  return (
    <div className="categoryGrid">
      {items.map((item) => (
        <Link className="categoryTile" href={item.href} key={item.href}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1020px) 50vw, 33vw"
          />
          <span>
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
          </span>
        </Link>
      ))}
    </div>
  );
}
