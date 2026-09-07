import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { Image, Root, RootContent, Text } from "mdast";
import type { Element, Root as HastRoot } from "hast";
import type { ElementType, ReactNode } from "react";

const contentDir = path.join(process.cwd(), "content");
const publicDir = path.join(process.cwd(), "public");

export const SITE_URL = "https://bayarea.wiki";

export const articleCategories = ["places", "culture-and-ideas", "artifacts"] as const;
export type ArticleCategory = (typeof articleCategories)[number];

type ArticleMeta = {
  title: string;
  excerpt: string | null;
  firstImageUrl: string | null;
};

type MarkdownComponents = Record<string, ElementType>;

type ArticleSource = {
  body: string;
  category: ArticleCategory;
  fileName: string;
  meta: ArticleMeta;
  slug: string;
};

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

async function getArticleSources(): Promise<ArticleSource[]> {
  const sources = (
    await Promise.all(
      articleCategories.map(async (category) => {
        const categoryDir = path.join(contentDir, category);
        const files = await readdir(categoryDir);

        return Promise.all(
          files
            .filter((fileName) => fileName.endsWith(".md"))
            .map(async (fileName) => {
              const fileContent = await readFile(
                path.join(categoryDir, fileName),
                "utf8"
              );

              return {
                body: fileContent,
                category,
                fileName,
                meta: extractArticleMeta(fileContent, fileName),
                slug: path.parse(fileName).name,
              };
            })
        );
      })
    )
  ).flat();

  const seenSlugs = new Set<string>();
  for (const source of sources) {
    if (seenSlugs.has(source.slug)) {
      throw new Error(`Duplicate article slug: ${source.slug}`);
    }
    seenSlugs.add(source.slug);
  }

  return sources;
}

async function readArticleSource(slug: string) {
  const source = (await getArticleSources()).find(
    (article) => article.slug === slug
  );

  if (!source) {
    throw new Error(`Article not found: ${slug}`);
  }

  return source;
}

function extractArticleMeta(body: string, fileName: string): ArticleMeta {
  const ast = unified().use(remarkParse).use(remarkGfm).parse(body) as Root;
  const titleNode = ast.children[0];

  if (titleNode?.type !== "heading" || titleNode.depth !== 1) {
    throw new Error(`Article ${fileName} must begin with a level-one heading.`);
  }

  const title = extractTextFromNode(titleNode).trim();
  if (!title) {
    throw new Error(`Article ${fileName} has an empty title.`);
  }

  let excerpt: string | null = null;
  let firstImageUrl: string | null = null;

  visit(ast, "paragraph", (node: RootContent) => {
    if (!excerpt) {
      excerpt = extractTextFromNode(node).trim() || null;
    }
  });

  visit(ast, "image", (node: RootContent) => {
    if (!firstImageUrl) {
      firstImageUrl = (node as Image).url;
    }
  });

  if (!excerpt) {
    throw new Error(`Article ${fileName} needs an introductory paragraph.`);
  }

  return { title, excerpt, firstImageUrl };
}

// Markdown images are string paths, so next/image can't infer their size the
// way it does for static imports. Read the intrinsic dimensions of images
// under /public at build time instead. sharp already ships with Next.
async function getImageDimensions(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;

  try {
    const { width, height, orientation } = await sharp(
      path.join(publicDir, decodeURIComponent(src))
    ).metadata();
    if (!width || !height) return null;
    // EXIF orientations 5-8 display the image rotated 90 degrees
    return (orientation ?? 1) >= 5 ? { width: height, height: width } : { width, height };
  } catch {
    return null;
  }
}

function rehypeImageDimensions() {
  return async (tree: HastRoot) => {
    const images: Element[] = [];
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img" && typeof node.properties.src === "string") {
        images.push(node);
      }
    });

    for (const image of images) {
      const size = await getImageDimensions(image.properties.src as string);
      if (size) Object.assign(image.properties, size);
    }
  };
}

function rehypeFigureCaptions() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "p" || node.children.length !== 1) {
        return;
      }

      const image = node.children[0];
      if (image.type !== "element" || image.tagName !== "img") {
        return;
      }

      const caption = image.properties.title;
      delete image.properties.title;
      node.tagName = "figure";

      if (typeof caption === "string" && caption) {
        node.children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: caption }],
        });
      }
    });
  };
}

export async function getArticle(
  slug: string,
  components?: MarkdownComponents
): Promise<{
  title: string;
  category: ArticleCategory;
  content: ReactNode;
  excerpt: string | null;
  firstImageUrl: string | null;
  slug: string;
}> {
  const source = await readArticleSource(slug);
  const { content } = await compileMDX({
    source: source.body,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeFigureCaptions, rehypeImageDimensions],
      },
    },
    components,
  });

  return {
    title: source.meta.title,
    category: source.category,
    content,
    excerpt: source.meta.excerpt,
    firstImageUrl: source.meta.firstImageUrl,
    slug: source.slug,
  };
}

export async function getArticles() {
  const sources = await getArticleSources();

  return sources.map((source) => ({
    title: source.meta.title,
    category: source.category,
    excerpt: source.meta.excerpt,
    firstImageUrl: source.meta.firstImageUrl,
    slug: source.slug,
  }));
}

export async function getAllArticleSlugs() {
  return (await getArticleSources()).map(({ slug }) => ({ slug }));
}
