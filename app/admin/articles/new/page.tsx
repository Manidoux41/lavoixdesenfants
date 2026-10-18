import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleEditor } from "@/app/admin/articles/article-editor";
import { requireAdminUser } from "@/lib/admin-auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewArticlePage() {
  const user = await requireAdminUser();
  const categories = await db.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <main className="admin-main admin-editor-page" id="contenu">
      <Link className="admin-back" href="/admin/articles"><ArrowLeft size={15} aria-hidden="true" /> Tous les articles</Link>
      <div className="admin-page-heading"><div><p className="admin-kicker">CONTENUS / NOUVEAU</p><h1>Nouvel article</h1><p>Enregistrez un brouillon ou publiez lorsque le contenu est prêt.</p></div></div>
      <ArticleEditor categories={categories} canManageCategories={user.role === UserRole.ADMIN} canPublish={user.role === UserRole.ADMIN} />
    </main>
  );
}
