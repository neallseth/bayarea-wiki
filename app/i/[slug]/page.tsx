import { getArticleBySlug, getAllArticleSlugs } from "../content-utils";

export async function generateStaticParams() {
  return getAllArticleSlugs();
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getArticleBySlug(params.slug);
  console.log(blog.frontmatter.title);
  return (
    <main className="prose">
      <h1>{blog.frontmatter.title}</h1>
      <article>{blog.content}</article>
    </main>
  );
}
