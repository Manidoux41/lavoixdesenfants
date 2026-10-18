import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ArticleStatus, UserRole } from "@prisma/client";
import { ArticleEditor } from "@/app/admin/articles/article-editor";
import { requireAdminUser } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier l’article" };

export default async function EditArticlePage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireAdminUser();
  const [{ id }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const article = await db.article.findUnique({
    where: {
      id,
      ...(user.role === UserRole.CONTRIBUTOR
        ? { authorId: user.id, status: { in: [ArticleStatus.DRAFT, ArticleStatus.IN_REVIEW] } }
        : {}),
    },
    include: { categories: { select: { id: true, name: true } } },
  });
  if (!article) notFound();
  const categories = await db.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
  const saved = query.saved === "1";
  const dateValue = article.publishedAt
    ? new Date(article.publishedAt.getTime() - article.publishedAt.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
    : "";

  return (
    <main className="admin-main admin-editor-page" id="contenu">
      <Link className="admin-back" href="/admin/articles"><ArrowLeft size={15} aria-hidden="true" /> Tous les articles</Link>
      <div className="admin-page-heading">
        <div><p className="admin-kicker">CONTENUS / MODIFICATION</p><h1>Modifier l’article</h1><p>Dernière modification : {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(article.updatedAt)}</p></div>
        {article.status === ArticleStatus.PUBLISHED && <Link className="admin-secondary" href={`/actualites/${article.slug}`} target="_blank">Voir la publication <ExternalLink size={14} aria-hidden="true" /></Link>}
      </div>
      <ArticleEditor
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          coverImageUrl: article.coverImageUrl,
          coverImageAlt: article.coverImageAlt,
          status: article.status === ArticleStatus.ARCHIVED ? "DRAFT" : article.status,
          publishedAt: dateValue,
          categories: article.categories,
        }}
        categories={categories}
        canManageCategories={user.role === UserRole.ADMIN}
        canPublish={user.role === UserRole.ADMIN}
        saved={saved}
      />
    </main>
  );
}
