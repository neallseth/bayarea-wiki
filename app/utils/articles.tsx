import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MDXProvider } from "@mdx-js/react";

const contentDir = path.join(process.cwd(), "content");

export async function getArticle(
  slug: string,
  customComponents?: React.ComponentProps<typeof MDXProvider>["components"]
) {
  const fileName = slug + ".mdx";
  const filePath = path.join(contentDir, fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { frontmatter, content } = await compileMDX<{
    title: string;
    category?: string;
  }>({
    source: fileContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
    components: customComponents,
  });
  return {
    title: frontmatter.title,
    category: frontmatter.category,
    content,
    slug: path.parse(fileName).name,
  };
}

export async function getArticles() {
  const files = fs.readdirSync(contentDir);
  const articles = await Promise.all(
    files.map(async (file) => await getArticle(path.parse(file).name))
  );
  return articles;
}

export function getAllArticleSlugs() {
  const files = fs.readdirSync(contentDir);
  const slugs = files.map((file) => ({ slug: path.parse(file).name }));
  return slugs;
}
