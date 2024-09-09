import Link from "next/link";
import { getArticles } from "../content-utils";

export default async function Explore() {
  const articles = await getArticles();
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.slug}>
          <Link href={`/${article.slug}`}>{article.title}</Link>
        </li>
      ))}
    </ul>
  );
}
