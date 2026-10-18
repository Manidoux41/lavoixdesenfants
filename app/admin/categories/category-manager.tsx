"use client";

import { useActionState } from "react";
import { FolderPlus } from "lucide-react";
import { createCategoryAction, type CategoryFormState } from "@/app/admin/categories/actions";

type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { articles: number };
};

const initialState: CategoryFormState = {};

export function CategoryManager({ categories }: { categories: CategorySummary[] }) {
  const [state, action, pending] = useActionState(createCategoryAction, initialState);

  return (
    <>
      <form className="admin-editor category-create-form" action={action}>
        <div className="admin-editor-row">
          <div className="admin-field">
            <label htmlFor="category-name">Nom de la catégorie</label>
            <input id="category-name" name="name" required minLength={2} maxLength={60} />
            <small>L’adresse de la catégorie est générée automatiquement.</small>
          </div>
          <div className="admin-field">
            <label htmlFor="category-description">Description (facultatif)</label>
            <input id="category-description" name="description" maxLength={180} />
            <small>180 caractères maximum.</small>
          </div>
        </div>
        {state.error && <p className="admin-error" role="alert">{state.error}</p>}
        {state.success && <p className="admin-success" role="status">{state.success}</p>}
        <div className="admin-form-actions">
          <button className="admin-primary" type="submit" disabled={pending}>
            <FolderPlus size={16} aria-hidden="true" /> {pending ? "Création…" : "Créer la catégorie"}
          </button>
        </div>
      </form>

      <section className="admin-panel category-list" aria-label="Catégories existantes">
        {categories.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th scope="col">Catégorie</th><th scope="col">Adresse</th><th scope="col">Articles liés</th></tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <th scope="row">
                      {category.name}
                      {category.description && <small>{category.description}</small>}
                    </th>
                    <td>/{category.slug}</td>
                    <td>{category._count.articles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <p>Aucune catégorie pour le moment.</p>
            <span>Créez-en une ci-dessus pour pouvoir la choisir dans un article.</span>
          </div>
        )}
      </section>
    </>
  );
}
