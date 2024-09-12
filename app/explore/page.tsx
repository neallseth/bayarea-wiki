import Link from "next/link";
import { getArticles } from "../content-utils";
import { ReactElement } from "react";

// Mapping between category IDs (as used in MDX frontmatter - e.g., 'place') and category display title (e.g., 'Places')
const categoryNameMap = {
  place: "Places",
  misc: "Misc",
};

type Article = {
  title: string;
  category: string | undefined;
  content: ReactElement;
  slug: string;
};

type GroupedArticles = { [key: string]: Article[] };

function groupArticlesByCategory(articles: Article[]) {
  const groupedArticles: GroupedArticles = {};
  articles.forEach((article) => {
    const category =
      article.category && article.category in categoryNameMap
        ? article.category
        : "misc";

    groupedArticles[category]
      ? groupedArticles[category].push(article)
      : (groupedArticles[category] = [article]);
  });

  return groupedArticles;
}

export default async function Explore() {
  const articles = await getArticles();
  const articlesByCategory = groupArticlesByCategory(articles);
  return (
    <div className="flex flex-col gap-8">
      {Object.entries(articlesByCategory).map(([category, articles]) => (
        <div key={category} className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            {category in categoryNameMap
              ? categoryNameMap[category as keyof typeof categoryNameMap]
              : ""}
          </h2>
          <div className="flex flex-col gap-1">
            {articles.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`}>
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
