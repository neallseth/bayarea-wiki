import { getArticles } from "@/lib/articles";
import CoreLayout from "@/components/core-layout";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";
import type { Metadata } from "next";

const title = "All articles";
const description =
  "An evolving collection of places, culture, and ideas from the San Francisco Bay Area.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/explore" },
  openGraph: { type: "website", url: "/explore", title, description },
  twitter: { title, description },
};

const categoryDetails = {
  places: {
    id: "places",
    title: "Places",
  },
  "culture-and-ideas": {
    id: "culture-and-ideas",
    title: "Culture & ideas",
  },
  artifacts: {
    id: "artifacts",
    title: "Artifacts",
  },
} as const;

type Category = keyof typeof categoryDetails;

export default async function Explore() {
  const articles = await getArticles();

  return (
    <CoreLayout hideExplore>
      <header className="mb-14">
        <h1 className={`${lora.className} text-4xl font-semibold tracking-[-0.025em] sm:text-5xl`}>
          All articles
        </h1>
        <p className="mt-5 max-w-[56ch] text-lg leading-8 text-[var(--muted)]">
          An evolving collection of{" "}
          <Link
            href="#places"
            className="text-[var(--accent-dark)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]"
          >
            places
          </Link>
          ,{" "}
          <Link
            href="#culture-and-ideas"
            className="text-[var(--accent-dark)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]"
          >
            culture and ideas
          </Link>
          , and{" "}
          <Link
            href="#artifacts"
            className="text-[var(--accent-dark)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]"
          >
            artifacts
          </Link>
        </p>
      </header>

      <div className="space-y-16">
        {(Object.keys(categoryDetails) as Category[]).map((category) => {
          const categoryArticles = articles
            .filter((article) => article.category === category)
            .sort((a, b) => a.title.localeCompare(b.title));
          const details = categoryDetails[category];

          return (
            <section id={details.id} key={category} aria-labelledby={`${category}-heading`} className="scroll-mt-8">
              <div className="mb-3 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
                <h2 id={`${category}-heading`} className={`${lora.className} text-2xl font-semibold`}>
                  {details.title}
                </h2>
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
