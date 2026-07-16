import { getArticles } from "@/lib/articles";
import CoreLayout from "@/components/core-layout";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Browse the Bay Area Wiki archive of notable places, communities, institutions, eras, and ideas.",
  alternates: { canonical: "/explore" },
};

const categoryDetails = {
  place: {
    title: "Places",
    description: "Group houses, gathering spaces, campuses, and institutions.",
  },
  misc: {
    title: "Ideas & histories",
    description: "The scenes, social forms, and eras that connect the Bay Area.",
  },
} as const;

type Category = keyof typeof categoryDetails;

export default async function Explore() {
  const articles = await getArticles();

  return (
    <CoreLayout>
      <header className="mb-14">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
          The archive
        </p>
        <h1 className={`${lora.className} text-4xl font-semibold tracking-[-0.025em] sm:text-5xl`}>
          Explore the Bay Area Wiki
        </h1>
        <p className="mt-5 max-w-[56ch] text-lg leading-8 text-[var(--muted)]">
          An evolving collection of places, communities, institutions, and ideas that have shaped the Bay Area’s cultural life.
        </p>
      </header>

      <div className="space-y-16">
        {(Object.keys(categoryDetails) as Category[]).map((category) => {
          const categoryArticles = articles
            .filter((article) => (article.category ?? "misc") === category)
            .sort((a, b) => a.title.localeCompare(b.title));
          const details = categoryDetails[category];

          return (
            <section key={category} aria-labelledby={`${category}-heading`}>
              <div className="mb-3 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
                <div>
                  <h2 id={`${category}-heading`} className={`${lora.className} text-2xl font-semibold`}>
                    {details.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{details.description}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--muted)]">
                  {categoryArticles.length} {categoryArticles.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              <div className="divide-y divide-[var(--line)]">
                {categoryArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className="group grid gap-2 py-5 no-underline sm:grid-cols-[15rem_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <h3 className={`${lora.className} text-lg font-semibold group-hover:text-[var(--accent-dark)]`}>
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{article.excerpt}</p>
                    <span aria-hidden="true" className="hidden text-[var(--accent)] transition-transform group-hover:translate-x-1 sm:block">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </CoreLayout>
  );
}
