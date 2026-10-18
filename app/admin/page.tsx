import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePlus2 } from "lucide-react";
import { ArticleStatus, ModerationStatus } from "@prisma/client";
import { requireAdminUser } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const user = await requireAdminUser();
  const [published, drafts, inReview, testimonials, recentArticles] = await Promise.all([
    db.article.count({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
        archivedAt: null,
      },
    }),
    db.article.count({ where: { status: ArticleStatus.DRAFT } }),
    db.article.count({ where: { status: ArticleStatus.IN_REVIEW } }),
    db.testimonial.count({ where: { moderationStatus: ModerationStatus.PENDING } }),
    db.article.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
  ]);
  const date = (value: Date) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(value);

  return (
    <main className="admin-main" id="contenu">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">TABLEAU DE BORD</p>
          <h1>Bonjour{user.name ? `, ${user.name}` : ""}.</h1>
          <p>Voici un aperçu des contenus éditoriaux.</p>
        </div>
        <Link className="admin-primary" href="/admin/articles/new"><FilePlus2 size={16} aria-hidden="true" /> Nouvel article</Link>
      </div>
      <section className="admin-stats" aria-label="Statistiques éditoriales">
        <div><span>Articles publiés</span><strong>{published}</strong></div>
        <div><span>Brouillons</span><strong>{drafts}</strong></div>
        <div><span>À relire</span><strong>{inReview}</strong></div>
        <div><span>Témoignages à modérer</span><strong>{testimonials}</strong></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Dernières modifications</h2>
          <Link href="/admin/articles">Tous les articles <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        {recentArticles.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th scope="col">Titre</th><th scope="col">Statut</th><th scope="col">Modifié le</th><th scope="col"><span className="sr-only">Modifier</span></th></tr></thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id}>
                    <th scope="row">{article.title}</th>
                    <td><span className={`status-pill status-${article.status.toLowerCase()}`}>{article.status}</span></td>
                    <td>{date(article.updatedAt)}</td>
                    <td><Link href={`/admin/articles/${article.id}/edit`}>Modifier</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <p>Aucun article pour le moment.</p>
            <Link href="/admin/articles/new">Créer le premier article <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        )}
      </section>
      <p className="admin-callout">
        La modération des témoignages et la médiathèque nécessitent encore leur interface d’administration.
      </p>
    </main>
  );
}
