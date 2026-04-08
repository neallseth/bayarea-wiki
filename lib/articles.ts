import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import type { Image, Root, RootContent, Text } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import type { ElementType, ReactNode } from "react";

const contentDir = path.join(process.cwd(), "content");

type ArticleFrontmatter = {
  title: string;
  category?: string;
};

type MdxComponents = Record<string, ElementType>;

function extractTextFromNode(node: RootContent): string {
  if (node.type === "text") {
    return (node as Text).value;
  }

  if ("children" in node) {
    return node.children
      .map((child) => extractTextFromNode(child as RootContent))
      .join("");
  }

  return "";
}

async function readArticleFile(slug: string) {
  const fileName = `${slug}.mdx`;
  const filePath = path.join(contentDir, fileName);
  const fileContent = await readFile(filePath, "utf8");

  return { fileName, fileContent };
}

async function extractArticleMeta(fileContent: string) {
  const ast = unified().use(remarkParse).use(remarkMdx).parse(fileContent) as Root;

  let excerpt: string | null = null;
  let firstImageUrl: string | null = null;

  visit(ast, "paragraph", (node: RootContent) => {
    if (!excerpt) {
      excerpt = extractTextFromNode(node);
    }
  });

  visit(ast, "image", (node: RootContent) => {
    if (!firstImageUrl) {
      firstImageUrl = (node as Image).url;
    }
  });

  visit(ast, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
    if (firstImageUrl || node.name !== "ImageCard") {
      return;
    }

    const imageProp = node.attributes.find(
      (attr) => attr.type === "mdxJsxAttribute" && attr.name === "imageSrc"
    );

    if (imageProp?.value && typeof imageProp.value === "string") {
      firstImageUrl = imageProp.value;
    }
  });

  return { excerpt, firstImageUrl };
}

export async function getArticle(
  slug: string,
  components?: MdxComponents
): Promise<{
  title: string;
  category: string | undefined;
  content: ReactNode;
  excerpt: string | null;
  firstImageUrl: string | null;
  slug: string;
}> {
  const { fileName, fileContent } = await readArticleFile(slug);
  const [{ frontmatter, content }, { excerpt, firstImageUrl }] =
    await Promise.all([
      compileMDX<ArticleFrontmatter>({
        source: fileContent,
        options: {
          parseFrontmatter: true,
          mdxOptions: { remarkPlugins: [remarkGfm] },
        },
        components,
      }),
      extractArticleMeta(fileContent),
    ]);

  return {
    title: frontmatter.title,
    category: frontmatter.category,
    content,
    excerpt,
    firstImageUrl,
    slug: path.parse(fileName).name,
  };
}

export async function getArticles() {
  const files = await readdir(contentDir);

  return Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => getArticle(path.parse(file).name))
  );
}

export async function getAllArticleSlugs() {
  const files = await readdir(contentDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: path.parse(file).name }));
}
