import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs } from "../content-utils";
import Image from "next/image";
import { lora } from "../fonts/fonts";

export async function generateStaticParams() {
  return getAllArticleSlugs();
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
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
      </div>

      <article className="prose w-full">
        <h1 className={`mb-2 text-2xl font-semibold ${lora.className}`}>
          {article.title}
        </h1>
        <div className="w-full bg-black h-[.01rem]"></div>
        <article>{article.content}</article>
      </article>
    </div>
  );
}
