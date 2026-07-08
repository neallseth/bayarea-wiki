import { getAllArticleSlugs, getArticle } from "@/app/utils/articles";
import { lora } from "../fonts/fonts";
import { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import {
  ExternalLink,
  HorizontalRule,
  InternalLink,
} from "@/components/core-elements";
import CoreLayout from "@/components/core-layout";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
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
        ? article.firstImageUrl
        : [...previousImages],
    },
  };
}

const articleComponents = {
  h1: (props: { children?: ReactNode }) => (
    <h1 className={`${lora.className} font-semibold text-2xl mb-4`}>
      {props.children}
    </h1>
  ),
  h2: (props: { children?: ReactNode }) => (
    <>
      <h2 className={`${lora.className} font-semibold text-xl`}>
        {props.children}
      </h2>
      <HorizontalRule />
    </>
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className={`${lora.className} font-semibold text-lg mb-2`}>
      {props.children}
    </h3>
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="text-base leading-relaxed text-gray-900 mb-4">
      {props.children}
    </p>
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="list-disc list-inside pl-5 mb-4">{props.children}</ul>
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="list-decimal pl-5 mb-4">{props.children}</ol>
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="mb-1 leading-relaxed">{props.children}</li>
  ),
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
      {props.children}
    </blockquote>
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
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
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (props.href?.startsWith("/")) {
      return <InternalLink {...props}>{props.children}</InternalLink>;
    } else {
      return <ExternalLink {...props}>{props.children}</ExternalLink>;
    }
  },
  ImageCard: (props: { name: string; imageSrc: string }) => (
    <div className="border border-gray-300 rounded-lg overflow-hidden my-4">
      <Image
        src={props.imageSrc}
        alt={props.name}
        className="w-full h-auto"
        width={300}
        height={300}
      />
      <p className="p-4 text-sm text-gray-800">{props.name}</p>
    </div>
  ),
  HorizontalRule: () => <HorizontalRule />,
};

export async function generateStaticParams() {
  return getAllArticleSlugs();
}

// Only slugs from generateStaticParams exist; anything else 404s instead of
// hitting the filesystem and throwing a 500
export const dynamicParams = false;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug, articleComponents);
  return (
    <CoreLayout>
      <article className="w-full">
        <h1 className={`text-2xl font-semibold ${lora.className}`}>
          {article.title}
        </h1>
        <HorizontalRule />
        {article.content}
      </article>
    </CoreLayout>
  );
}
