import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elimaz Shop",
    short_name: "Elimaz",
    description: "Modern fashion storefront for everyday shopping.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#20211f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
