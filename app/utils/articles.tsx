import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MDXProvider } from "@mdx-js/react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";

import { Root, RootContent, Text, Image } from "mdast"; // Types for Markdown AST
import { MdxJsxFlowElement } from "mdast-util-mdx"; // Type for MDX JSX elements

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

  // Use remark to parse the MDX content into an AST, including MDX components
  const ast = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(fileContent) as Root;

  let firstParagraph: string | null = null;
  let firstImageUrl: string | null = null;

  // Helper function to extract text content from a node and its children
  function extractTextFromNode(node: RootContent): string {
    let text = "";

    if (node.type === "text") {
      text += (node as Text).value;
    } else if ("children" in node) {
      (node.children as RootContent[]).forEach((child) => {
        text += extractTextFromNode(child);
      });
    }

    return text;
  }

  // Traverse the AST to find the first paragraph and the first image
  visit(ast, "paragraph", (node: RootContent) => {
    if (!firstParagraph) {
      firstParagraph = extractTextFromNode(node);
    }
  });

  visit(ast, "image", (node: RootContent) => {
    if (!firstImageUrl) {
      firstImageUrl = (node as Image).url;
    }
  });

  visit(ast, "mdxJsxFlowElement", (node: MdxJsxFlowElement) => {
    if (!firstImageUrl && node.name === "ImageCard") {
      const imageProp = node.attributes.find(
        (attr) => attr.type === "mdxJsxAttribute" && attr.name === "imageSrc"
      );

      if (imageProp && imageProp.value && typeof imageProp.value === "string") {
        firstImageUrl = imageProp.value;
      }
    }
  });

  return {
    title: frontmatter.title,
    content,
    category: frontmatter.category,
    excerpt: firstParagraph as string | null,
    firstImageUrl: firstImageUrl as string | null,
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
