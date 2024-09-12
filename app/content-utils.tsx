import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ReactNode } from "react";

const contentDir = path.join(process.cwd(), "content");

export async function getArticleBySlug(slug: string) {
  const components = {
    h1: (props: { children?: ReactNode }): JSX.Element => (
      <h1 className="text-xs">{props.children || "Default Title"}</h1>
    ),
  };

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
    components,
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
    files.map(async (file) => await getArticleBySlug(path.parse(file).name))
  );
  return articles;
}

export function getAllArticleSlugs() {
  const files = fs.readdirSync(contentDir);
  const slugs = files.map((file) => ({ slug: path.parse(file).name }));
  return slugs;
}
