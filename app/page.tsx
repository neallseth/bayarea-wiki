import Image from "next/image";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";
import CoreLayout from "@/components/core-layout";
import { getArticles } from "@/lib/articles";

const featuredSlugs = ["megascene", "group-housing", "solaris"];

export default async function Home() {
  const articles = await getArticles();
  const featuredArticles = featuredSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article) => article !== undefined);

  return (
    <CoreLayout home>
      <section className="grid items-start gap-9 sm:grid-cols-[1fr_144px] sm:gap-12">
        <div>
          <h1 className={`${lora.className} text-4xl font-semibold tracking-[-0.025em] sm:text-5xl`}>
            Bay Area Wiki
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-8 text-[var(--muted)]">
            Recording culturally notable places, institutions, communities, and ideas emerging from the San Francisco Bay Area.
          </p>
          <div className="mt-8">
            <Link
              className="inline-block rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition-transform hover:-translate-y-0.5"
              href="/explore"
            >
              Explore the archive
            </Link>
          </div>
        </div>
        <Image
          src="/images/ggb.jpg"
          alt="Illustration of the Golden Gate Bridge"
          width={144}
          height={216}
          className="hidden h-[216px] w-36 rounded-md object-cover shadow-[0_18px_45px_rgba(52,43,31,0.18)] ring-1 ring-black/10 sm:block"
          priority
        />
      </section>

      <section className="mt-20 border-t border-[var(--line)] pt-7 sm:mt-24">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className={`${lora.className} text-2xl font-semibold tracking-tight`}>Start here</h2>
          <Link className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]" href="/explore">
            View all {articles.length} entries
          </Link>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {featuredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/${article.slug}`}
              className="group grid gap-2 py-5 no-underline sm:grid-cols-[13rem_1fr_auto] sm:items-baseline sm:gap-5"
            >
              <h3 className={`${lora.className} text-xl font-semibold group-hover:text-[var(--accent-dark)]`}>
                {article.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{article.excerpt}</p>
              <span aria-hidden="true" className="hidden text-[var(--accent)] transition-transform group-hover:translate-x-1 sm:block">→</span>
            </Link>
          ))}
        </div>
      </section>
    </CoreLayout>
  );
}
