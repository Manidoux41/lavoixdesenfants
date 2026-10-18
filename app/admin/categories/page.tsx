import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";
import { CategoryManager } from "@/app/admin/categories/category-manager";
import { requireAdministrator } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Catégories" };

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdministrator();
  const params = await searchParams;
  const categories = await db.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { articles: true } } },
  });

  return (
    <main className="admin-main" id="contenu">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">CONTENUS / ORGANISATION</p>
          <h1>Catégories</h1>
          <p>Créez les thèmes qui permettront de classer les articles et de les retrouver.</p>
        </div>
        <span className="admin-category-count"><FolderOpen size={16} aria-hidden="true" /> {categories.length} catégorie{categories.length === 1 ? "" : "s"}</span>
      </div>
      {params.error === "category-invalid" && <p className="admin-error" role="alert">Le nom ou la description de la catégorie est invalide.</p>}
      {params.error === "category-duplicate" && <p className="admin-error" role="alert">Une catégorie utilise déjà cette adresse.</p>}
      {params.success === "category-updated" && <p className="admin-success" role="status">Catégorie modifiée.</p>}
      {params.success === "category-deleted" && <p className="admin-success" role="status">Catégorie supprimée.</p>}
      <CategoryManager categories={categories} />
      <p className="admin-callout">Une catégorie doit être sélectionnée dans l’éditeur d’un article pour apparaître comme lien de thème sur le site.</p>
    </main>
  );
}
