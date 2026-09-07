import type { MetadataRoute } from "next";
import { getAllArticleSlugs, SITE_URL } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllArticleSlugs();
  const articles = slugs.map(({ slug }) => ({
    url: `${SITE_URL}/${slug}`,
  }));

  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/explore`, priority: 0.8 },
    ...articles,
  ];
}
