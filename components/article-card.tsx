import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { ArticleCardData } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleCardData }) {
  const date = article.publishedAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(article.publishedAt)
    : null;

  return (
    <article className="article-card">
      <Link className="article-card-art" href={`/actualites/${article.slug}`} aria-label={`Lire : ${article.title}`}>
        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="article-card-cover"
            src={article.coverImageUrl}
            alt={article.coverImageAlt ?? ""}
          />
        )}
        <span className="article-art-tag">{article.categories[0]?.name ?? "Actualité"}</span>
        <span className="article-art-word" aria-hidden="true">ÉCOUTER<br />AGIR.</span>
        <span className="article-art-number" aria-hidden="true">LVE / 38</span>
        <ArrowUpRight className="article-art-arrow" size={21} aria-hidden="true" />
      </Link>
      <div className="article-card-body">
        {date && <p className="article-date"><CalendarDays size={14} aria-hidden="true" /> {date}</p>}
        <h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" href={`/actualites/${article.slug}`}>
          Lire l’article <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
