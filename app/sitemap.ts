import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllArticleSlugs();
  const articles = slugs.map(({ slug }) => ({
    url: `https://bayarea.wiki/${slug}`,
  }));

  return [
    { url: "https://bayarea.wiki" },
    { url: "https://bayarea.wiki/explore" },
    ...articles,
  ];
}
