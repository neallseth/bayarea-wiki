import { getAllArticleSlugs, getArticle } from "@/app/utils/articles";
import { lora } from "../fonts/fonts";
import { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { HorizontalRule } from "@/components/core-elements";
import CoreLayout from "@/components/core-layout";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  const article = await getArticle(slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.title,
    description: article.excerpt,

    openGraph: {
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
        ? `https://bayarea.wiki/${article.firstImageUrl}`
        : [...previousImages],
    },
  };
}

const articleComponents = {
  h1: (props: { children?: ReactNode }): JSX.Element => (
    <h1 className={`${lora.className} font-semibold text-2xl mb-4`}>
      {props.children}
    </h1>
  ),
  h2: (props: { children?: ReactNode }): JSX.Element => (
    <>
      <h2 className={`${lora.className} font-semibold text-xl`}>
        {props.children}
      </h2>
      <HorizontalRule />
    </>
  ),
  h3: (props: { children?: ReactNode }): JSX.Element => (
    <h3 className={`${lora.className} font-semibold text-lg mb-2`}>
      {props.children}
    </h3>
  ),
  p: (props: { children?: ReactNode }): JSX.Element => (
    <p className="text-base leading-relaxed text-gray-900 mb-4">
      {props.children}
    </p>
  ),
  ul: (props: { children?: ReactNode }): JSX.Element => (
    <ul className="list-disc list-inside pl-5 mb-4">{props.children}</ul>
  ),
  ol: (props: { children?: ReactNode }): JSX.Element => (
    <ol className="list-decimal pl-5 mb-4">{props.children}</ol>
  ),
  li: (props: { children?: ReactNode }): JSX.Element => (
    <li className="mb-1 leading-relaxed">{props.children}</li>
  ),
  blockquote: (props: { children?: ReactNode }): JSX.Element => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
      {props.children}
    </blockquote>
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>): JSX.Element => (
    <figure>
      <img
        src={props.src ?? ""}
        alt={props.alt}
        className="max-w-full mx-auto"
      />
      {props.alt && (
        <figcaption className="text-center text-sm text-gray-600 mt-2">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>): JSX.Element => (
    <a
      href={props.href ?? "#"}
      className="text-blue-600 hover:underline hover:text-blue-400"
    >
      {props.children}
    </a>
  ),
  Card: (props: { name: string; imageSrc: string }): JSX.Element => (
    <div className="border border-gray-300 rounded-lg overflow-hidden my-4">
      <img src={props.imageSrc} alt={props.name} className="w-full h-auto" />
      <p className="p-4 text-sm text-gray-800">{props.name}</p>
    </div>
  ),
  HorizontalRule: () => <HorizontalRule />,
};

export async function generateStaticParams() {
  return getAllArticleSlugs();
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug, articleComponents);
  return (
    <CoreLayout>
      <article className="max-w-prose w-full">
        <h1 className={`text-2xl font-semibold ${lora.className}`}>
          {article.title}
        </h1>
        <HorizontalRule />
        <article>{article.content}</article>
      </article>
    </CoreLayout>
  );
}
