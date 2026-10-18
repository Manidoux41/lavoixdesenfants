import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePlus2, Search } from "lucide-react";
import { ArticleStatus } from "@prisma/client";
import { archiveArticleAction, deleteArticleAction, restoreArticleAction } from "@/app/admin/articles/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { requireAdminUser } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Articles" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const labels: Record<ArticleStatus, string> = {
  DRAFT: "Brouillon",
  IN_REVIEW: "À relire",
  SCHEDULED: "Programmé",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

export default async function AdminArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireAdminUser();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const requestedStatus = typeof params.statut === "string" ? params.statut : "";
  const status = Object.values(ArticleStatus).find((candidate) => candidate === requestedStatus);
  const articles = await db.article.findMany({
    where: {
      ...(query ? { title: { contains: query, mode: "insensitive" as const } } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 100,
    select: { id: true, title: true, slug: true, status: true, updatedAt: true, publishedAt: true },
  });
  const date = (value: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(value);

  return (
    <main className="admin-main" id="contenu">
      <div className="admin-page-heading">
        <div><p className="admin-kicker">CONTENUS</p><h1>Articles</h1><p>Gérez les brouillons et publications.</p></div>
        <Link className="admin-primary" href="/admin/articles/new"><FilePlus2 size={16} aria-hidden="true" /> Nouvel article</Link>
      </div>
      <form className="admin-filters" action="/admin/articles">
        <div className="admin-search"><Search size={16} aria-hidden="true" /><label className="sr-only" htmlFor="admin-query">Rechercher un titre</label><input id="admin-query" name="q" placeholder="Rechercher un titre" defaultValue={query} /></div>
        <label className="sr-only" htmlFor="admin-status-filter">Filtrer par statut</label>
        <select id="admin-status-filter" name="statut" defaultValue={status ?? ""}>
          <option value="">Tous les statuts</option>
          {Object.values(ArticleStatus).map((value) => <option key={value} value={value}>{labels[value]}</option>)}
        </select>
        <button className="admin-secondary" type="submit">Filtrer</button>
      </form>
      <section className="admin-panel">
        {articles.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th scope="col">Titre</th><th scope="col">Statut</th><th scope="col">Publication</th><th scope="col">Modifié le</th><th scope="col">Actions</th></tr></thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <th scope="row"><Link href={`/admin/articles/${article.id}/edit`}>{article.title}</Link><small>/{article.slug}</small></th>
                    <td><span className={`status-pill status-${article.status.toLowerCase()}`}>{labels[article.status]}</span></td>
                    <td>{article.publishedAt ? date(article.publishedAt) : "—"}</td>
                    <td>{date(article.updatedAt)}</td>
                    <td className="admin-row-actions">
                      <Link href={`/admin/articles/${article.id}/edit`}>Modifier</Link>
                      {article.status === ArticleStatus.ARCHIVED ? (
                        <form action={restoreArticleAction}><input type="hidden" name="id" value={article.id} /><button type="submit">Restaurer</button></form>
                      ) : (
                        <form action={archiveArticleAction}><input type="hidden" name="id" value={article.id} /><button type="submit">Archiver</button></form>
                      )}
                      {user.role === "ADMIN" && <form action={deleteArticleAction}><input type="hidden" name="id" value={article.id} /><ConfirmSubmitButton className="admin-danger" confirmation="Supprimer définitivement cet article ? Cette action est irréversible.">Supprimer</ConfirmSubmitButton></form>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty"><p>Aucun article ne correspond à ces critères.</p><Link href="/admin/articles/new">Créer un article <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        )}
      </section>
      <p className="admin-callout">Affichage limité aux 100 contenus les plus récemment modifiés.</p>
    </main>
  );
}
