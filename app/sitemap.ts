import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/app/utils/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticleSlugs().map(({ slug }) => ({
    url: `https://bayarea.wiki/${slug}`,
  }));

  return [
    { url: "https://bayarea.wiki" },
    { url: "https://bayarea.wiki/explore" },
    ...articles,
  ];
}
