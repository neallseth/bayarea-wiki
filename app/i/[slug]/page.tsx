import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs } from "../content-utils";
import Image from "next/image";

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
    <div>
      <Link className="contents" href={"/"}>
        <Image
          src="/images/ggb.jpg"
          className="mb-6"
          alt="Bay Area Wiki logo"
          width={30}
          height={38}
          priority
        />
      </Link>

      <main className="prose">
        <h1 className="mb-2 text-2xl font-semibold">
          {blog.frontmatter.title}
        </h1>
        <div className="w-full bg-black h-[.01rem]"></div>
        <article>{blog.content}</article>
      </main>
    </div>
  );
}
