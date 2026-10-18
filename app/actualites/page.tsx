import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { PageHeading } from "@/components/page-heading";
import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les actualités et informations publiées par La Voix des Enfants Placés.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function NewsList({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawQuery = typeof params.q === "string" ? params.q.trim() : "";
  const query = rawQuery.slice(0, 80);
  const category = typeof params.categorie === "string" ? params.categorie.slice(0, 80) : "";
  const requestedPage = Number(typeof params.page === "string" ? params.page : "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, 10_000)
    : 1;
  const { articles, categories, total, isDemo } = await getPublishedArticles({ query, category, page });
  const pageCount = Math.ceil(total / 9);
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("categorie", category);
    params.set("page", String(nextPage));
    return `/actualites?${params.toString()}`;
  };

  return (
    <>
      <section className="news-controls" aria-label="Rechercher les actualités">
        <form className="news-search" action="/actualites">
          <label className="sr-only" htmlFor="news-query">Rechercher par titre ou mot-clé</label>
          <Search size={17} aria-hidden="true" />
          <input id="news-query" type="search" name="q" placeholder="Rechercher une actualité" defaultValue={query} />
          {category && <input type="hidden" name="categorie" value={category} />}
          <button type="submit">Rechercher</button>
        </form>
        <div className="category-filters" aria-label="Filtrer par catégorie">
          <Link className={!category ? "filter-chip active" : "filter-chip"} href={`/actualites${query ? `?q=${encodeURIComponent(query)}` : ""}`}>Tout</Link>
          {categories.map((item) => {
            const search = new URLSearchParams();
            if (query) search.set("q", query);
            search.set("categorie", item.slug);
            return <Link className={category === item.slug ? "filter-chip active" : "filter-chip"} key={item.slug} href={`/actualites?${search.toString()}`}>{item.name}</Link>;
          })}
        </div>
      </section>
      {isDemo && <p className="demo-content-note" role="note">Aperçu sans base de données : les articles affichés sont des exemples fictifs et ne constituent pas des publications de l’association.</p>}
      {articles.length ? (
        <div className="article-grid news-list">
          {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      ) : (
        <div className="news-empty-state">
          <span className="empty-news-index">LVE / JOURNAL</span>
          <h2>{query || category ? "Aucun résultat pour cette recherche." : "Aucune actualité publiée pour le moment."}</h2>
          <p>Les articles publiés par l’association apparaîtront ici.</p>
          {(query || category) && <Link className="text-link" href="/actualites">Effacer les filtres <ArrowRight size={15} aria-hidden="true" /></Link>}
        </div>
      )}
      {pageCount > 1 && (
        <nav className="pagination" aria-label="Pagination des actualités">
          {page > 1 ? <Link href={pageHref(page - 1)}><ArrowLeft size={16} aria-hidden="true" /> Précédent</Link> : <span />}
          <span>Page {page} sur {pageCount}</span>
          {page < pageCount ? <Link href={pageHref(page + 1)}>Suivant <ArrowRight size={16} aria-hidden="true" /></Link> : <span />}
        </nav>
      )}
    </>
  );
}

export default function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Le journal de l’association"
        title="Actualités & repères."
        description="Informations, prises de parole et repères partagés par l’association."
      />
      <Suspense fallback={<div className="news-empty-state">Chargement des actualités…</div>}>
        <NewsList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
