import { getAllArticleSlugs, getArticle } from "@/lib/articles";
import { lora } from "../fonts/fonts";
import { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import {
  ExternalLink,
  HorizontalRule,
  InternalLink,
} from "@/components/core-elements";
import CoreLayout from "@/components/core-layout";
import { Metadata, ResolvingMetadata } from "next";

type RouteParams = Promise<{ slug: string }>;
type Props = {
  params: RouteParams;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/${slug}` },

    openGraph: {
      type: "article",
      url: `/${slug}`,
      siteName: "Bay Area Wiki",
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.firstImageUrl
        ? article.firstImageUrl
        : [...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      creator: "@neallseth",
      images: article.firstImageUrl
        ? article.firstImageUrl
        : [...previousImages],
    },
  };
}

const articleComponents = {
  h1: (props: { children?: ReactNode }) => (
    <>
      <h1 className={`${lora.className} text-4xl font-semibold tracking-[-0.025em] sm:text-5xl`}>
        {props.children}
      </h1>
      <div className="mb-8 mt-6 h-px bg-[var(--line)]" />
    </>
  ),
  h2: (props: { children?: ReactNode }) => (
    <>
      <h2 className={`${lora.className} mt-10 text-2xl font-semibold tracking-[-0.015em]`}>
        {props.children}
      </h2>
      <HorizontalRule />
    </>
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className={`${lora.className} mb-2 mt-8 text-xl font-semibold`}>
      {props.children}
    </h3>
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="mb-5 text-[17px] leading-7 text-[var(--foreground)]">
      {props.children}
    </p>
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="mb-5 list-disc space-y-1 pl-6 text-[17px] leading-7">{props.children}</ul>
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="mb-5 list-decimal space-y-1 pl-6 text-[17px] leading-7">{props.children}</ol>
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="pl-1">{props.children}</li>
  ),
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote className="my-7 border-l-2 border-[var(--accent)] pl-5 italic text-[var(--muted)]">
      {props.children}
    </blockquote>
  ),
  figure: (props: { children?: ReactNode }) => (
    <figure className="my-8">{props.children}</figure>
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={props.src ?? ""}
      alt={props.alt ?? ""}
      className="h-auto w-full rounded-md shadow-sm ring-1 ring-black/10"
      loading="lazy"
      decoding="async"
    />
  ),
  figcaption: (props: { children?: ReactNode }) => (
    <figcaption className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-sm leading-6 text-[var(--muted)]">
      {props.children}
    </figcaption>
  ),
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (props.href?.startsWith("/")) {
      return <InternalLink {...props}>{props.children}</InternalLink>;
    } else {
      return <ExternalLink {...props}>{props.children}</ExternalLink>;
    }
  },
};

export async function generateStaticParams() {
  return await getAllArticleSlugs();
}

// Only slugs from generateStaticParams exist; anything else 404s instead of
// hitting the filesystem and throwing a 500
export const dynamicParams = false;

export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;
  const article = await getArticle(slug, articleComponents);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.firstImageUrl
      ? new URL(article.firstImageUrl, "https://bayarea.wiki").toString()
      : undefined,
    mainEntityOfPage: `https://bayarea.wiki/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Bay Area Wiki",
      url: "https://bayarea.wiki",
    },
  };

  return (
    <CoreLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="w-full">
        {article.content}
      </article>
      <footer className="mt-16 border-t border-[var(--line)] pt-7 text-right text-sm">
        <ExternalLink
          className="no-underline"
          href={`https://github.com/neallseth/bayarea-wiki/edit/main/content/${article.category}/${slug}.md`}
        >
          Suggest an edit
        </ExternalLink>
      </footer>
    </CoreLayout>
  );
}
