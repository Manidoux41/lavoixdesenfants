import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { cache } from "react";
import { ArticleCard } from "@/components/article-card";
import { getPublishedArticleBySlug, getRelatedArticles } from "@/lib/articles";

const loadArticle = cache((slug: string) => getPublishedArticleBySlug(slug));

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.ogImageUrl ?? article.coverImageUrl
        ? [article.ogImageUrl ?? article.coverImageUrl!]
        : undefined,
    },
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();
  const related = await getRelatedArticles(slug, article.categories.map(({ slug: categorySlug }) => categorySlug));
  const paragraphs = article.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const petitionUrl = "https://c.org/9HPScMtP9C";

  return (
    <main className="article-page" id="contenu">
      <div className="article-topline">
        <Link className="text-link" href="/actualites"><ArrowLeft size={16} aria-hidden="true" /> Toutes les actualités</Link>
        <span>LA VOIX / JOURNAL</span>
      </div>
      <article>
        <header className="article-header">
          {"isPreview" in article && <p className="demo-article-notice">Aperçu local · cet article n’est pas encore enregistré en base de données.</p>}
          <div className="article-categories">
            {article.categories.map((category) => <Link href={`/actualites?categorie=${encodeURIComponent(category.slug)}`} key={category.slug}>{category.name}</Link>)}
          </div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.excerpt}</p>
          <div className="article-byline">
            {article.publishedAt && <span><CalendarDays size={15} aria-hidden="true" /> Publié le {formatDate(article.publishedAt)}</span>}
            {article.author.name && <span>Par {article.author.name}</span>}
            {article.updatedAt > article.createdAt && <span>Mis à jour le {formatDate(article.updatedAt)}</span>}
          </div>
        </header>
        {article.coverImageUrl && (
          <figure className="article-cover-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="article-cover" src={article.coverImageUrl} alt={article.coverImageAlt ?? ""} />
            <figcaption>Image d’illustration</figcaption>
          </figure>
        )}
        <div className="article-prose">
          {paragraphs.map((paragraph, index) => {
            const className = index === 0 ? "article-lead" : undefined;
            const petitionUrlIndex = paragraph.indexOf(petitionUrl);
            if (petitionUrlIndex >= 0) {
              return (
                <p className={className} key={index}>
                  {paragraph.slice(0, petitionUrlIndex)}
                  <a href={petitionUrl} rel="noreferrer" target="_blank">ouvrir la pétition sur Change.org</a>
                  {paragraph.slice(petitionUrlIndex + petitionUrl.length)}
                </p>
              );
            }
            return <p className={className} key={index}>{paragraph}</p>;
          })}
        </div>
        {article.tags.length > 0 && <ul className="article-tags" aria-label="Mots-clés">{article.tags.map((tag) => <li key={tag.slug}>#{tag.name}</li>)}</ul>}
      </article>
      <div className="article-end">
        <Link className="button button-dark" href="/actualites"><ArrowLeft size={16} aria-hidden="true" /> Retour aux actualités</Link>
        <Link className="text-link" href="/contact">Nous écrire <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <p className="eyebrow"><span className="eyebrow-mark" />À lire aussi</p>
          <h2>Pour poursuivre.</h2>
          <div className="article-grid">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div>
        </section>
      )}
    </main>
  );
}
