import { getArticles } from "../content-utils";
import { ReactElement } from "react";
import { InternalLink } from "@/components/core-elements";
import CoreLayout from "@/components/core-layout";

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
    <CoreLayout>
      <div className="flex flex-col gap-8 w-full">
        {Object.entries(articlesByCategory).map(([category, articles]) => (
          <div key={category} className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold relative top-6 left-4 px-2 bg-background max-w-fit text-gray-500">
              {category in categoryNameMap
                ? categoryNameMap[category as keyof typeof categoryNameMap]
                : ""}
            </h2>
            <div className="flex flex-col gap-1 items-start p-6 border-solid border-2 border-gray-300 rounded-md">
              {articles
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((a) => (
                  <InternalLink key={a.slug} href={`/${a.slug}`}>
                    {a.title}
                  </InternalLink>
                ))}
            </div>
          </div>
        ))}
      </div>
    </CoreLayout>
  );
}
