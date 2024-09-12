import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MDXProvider } from "@mdx-js/react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx"; // To handle MDX components
import { visit } from "unist-util-visit";

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
  const ast = unified().use(remarkParse).use(remarkMdx).parse(fileContent);

  let firstParagraph: string | null = null;
  let firstImageUrl: string | null = null;

  // Helper function to extract text content from a node and its children
  function extractTextFromNode(node: any): string {
    let text = "";

    if (node.type === "text") {
      text += node.value;
    } else if (node.children) {
      node.children.forEach((child: any) => {
        text += extractTextFromNode(child);
      });
    }

    return text;
  }

  // Traverse the AST to find the first paragraph and the first image
  visit(ast, (node) => {
    // Look for the first paragraph
    if (!firstParagraph && node.type === "paragraph") {
      firstParagraph = extractTextFromNode(node);
    }

    // Look for the first image (Markdown image syntax `![alt](url)`)
    if (!firstImageUrl && node.type === "image") {
      firstImageUrl = node.url;
    }

    // Look for custom components like <Card> with an `imageSrc` prop
    if (
      !firstImageUrl &&
      node.type === "mdxJsxFlowElement" &&
      node.name === "Card"
    ) {
      const imageProp = node.attributes.find(
        (attr: any) => attr.name === "imageSrc"
      );
      if (imageProp && imageProp.value) {
        firstImageUrl = imageProp.value; // Extract imageSrc from the <Card> component
      }
    }
  });

  // Return metadata including the first paragraph and first image
  return {
    title: frontmatter.title,
    content,
    category: frontmatter.category || null,
    excerpt: firstParagraph || null, // first paragraph as excerpt
    firstImageUrl: firstImageUrl || null, // first image URL or from Card component
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
