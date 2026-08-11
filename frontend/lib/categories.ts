import type { Category } from "@/lib/api";

export const CLOTHING_CATEGORY_SLUGS = ["ao-so-mi", "chan-vay", "set-bo"] as const;

export type ClothingCategorySlug = (typeof CLOTHING_CATEGORY_SLUGS)[number];

export type ClothingCategoryDefinition = {
  slug: ClothingCategorySlug;
  name: string;
  description: string;
  image: string;
};

export const clothingCategoryDefinitions: ClothingCategoryDefinition[] = [
  {
    slug: "ao-so-mi",
    name: "Áo sơ mi",
    description: "Thiết kế áo sơ mi thanh lịch cho mọi dịp",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b00?auto=format&fit=crop&w=900&q=84",
  },
  {
    slug: "chan-vay",
    name: "Chân váy",
    description: "Chân váy thời trang nữ tính và hiện đại",
    image: "https://images.unsplash.com/photo-1583496661163-f53e4a1b2c1f?auto=format&fit=crop&w=900&q=84",
  },
  {
    slug: "set-bo",
    name: "Set bộ",
    description: "Set đồ bộ phối sẵn, mặc là đẹp",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=84",
  },
];

const definitionBySlug = new Map(clothingCategoryDefinitions.map((item) => [item.slug, item]));

export function pickStorefrontCategories(categories: Category[] = [], forFilter = false) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  const merged = CLOTHING_CATEGORY_SLUGS.map((slug) => {
    const fromApi = bySlug.get(slug);
    const definition = definitionBySlug.get(slug);

    if (fromApi) {
      return {
        ...fromApi,
        name: definition?.name || fromApi.name,
        description: definition?.description || fromApi.description || "",
      };
    }

    return {
      id: 0,
      slug,
      name: definition?.name || slug,
      description: definition?.description || "",
    } satisfies Category;
  });

  return forFilter ? merged.filter((category) => category.id > 0) : merged;
}

export function categoryImageForSlug(slug?: string | null, index = 0) {
  const definition = slug ? definitionBySlug.get(slug as ClothingCategorySlug) : undefined;
  if (definition) return definition.image;

  const fallback = clothingCategoryDefinitions[index % clothingCategoryDefinitions.length];
  return fallback?.image || clothingCategoryDefinitions[0].image;
}
