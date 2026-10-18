"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import {
  createArticleAction,
  updateArticleAction,
  type ArticleFormState,
} from "@/app/admin/articles/actions";

type CategoryOption = { id: string; name: string };

type ArticleFormData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  status?: "DRAFT" | "IN_REVIEW" | "SCHEDULED" | "PUBLISHED";
  publishedAt?: string;
  categories?: CategoryOption[];
};

const initialState: ArticleFormState = {};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticleEditor({
  article,
  categories,
  saved = false,
}: {
  article?: ArticleFormData;
  categories: CategoryOption[];
  saved?: boolean;
}) {
  const actionFunction = article?.id ? updateArticleAction : createArticleAction;
  const [state, action, pending] = useActionState(actionFunction, initialState);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(article?.slug));

  return (
    <form className="admin-editor" action={action}>
      {article?.id && <input type="hidden" name="id" value={article.id} />}
      {saved && <p className="admin-success" role="status">Modifications enregistrées.</p>}
      <div className="admin-field">
        <label htmlFor="article-title">Titre</label>
        <input
          id="article-title"
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!slugEdited) setSlug(createSlug(event.target.value));
          }}
          required
          minLength={3}
          maxLength={160}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="article-slug">Adresse de l’article</label>
        <div className="admin-slug-input">
          <span>/actualites/</span>
          <input
            id="article-slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlug(createSlug(event.target.value));
              setSlugEdited(true);
            }}
            required
            minLength={3}
            maxLength={180}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </div>
      </div>
      <div className="admin-field">
        <label htmlFor="article-excerpt">Chapô / résumé</label>
        <textarea id="article-excerpt" name="excerpt" defaultValue={article?.excerpt} rows={3} required minLength={10} maxLength={320} />
        <small>320 caractères maximum.</small>
      </div>
      <div className="admin-field">
        <label htmlFor="article-content">Contenu</label>
        <textarea id="article-content" name="content" defaultValue={article?.content} rows={16} required maxLength={100_000} />
        <small>Texte brut. Les balises HTML ne sont pas interprétées.</small>
      </div>
      <div className="admin-editor-row">
        <div className="admin-field">
          <label htmlFor="article-cover">Image de couverture</label>
          <select id="article-cover" name="coverImageUrl" defaultValue={article?.coverImageUrl ?? ""}>
            <option value="">Aucune image</option>
            <option value="/images/family-silhouettes.jpg">Famille réunie · silhouettes (illustration)</option>
            <option value="/images/support-community.jpg">Soutien entre adultes (illustration)</option>
            <option value="/images/access-to-information.jpg">Information et démarches (illustration)</option>
            <option value="/images/parent-child-together.jpg">Parent et enfant ensemble (illustration)</option>
            <option value="/images/father-child-walk.jpg">Un père et son enfant, de dos (illustration)</option>
            <option value="/images/parent-child-shoreline.jpg">Un parent et un enfant au bord de l’eau (illustration)</option>
            <option value="/images/mother-child-distance.jpg">Distance entre mère et enfant · illustration artistique</option>
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="article-cover-alt">Texte alternatif de l’image</label>
          <input id="article-cover-alt" name="coverImageAlt" defaultValue={article?.coverImageAlt ?? ""} maxLength={250} />
          <small>Requis si une image de couverture est choisie.</small>
        </div>
      </div>
      <div className="admin-field">
        <label htmlFor="article-categories">Catégories</label>
        {categories.length ? (
          <>
            <select id="article-categories" name="categoryIds" multiple size={Math.min(categories.length, 5)} defaultValue={article?.categories?.map(({ id }) => id)}>
              {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
            <small>Vous pouvez associer plusieurs thèmes à cet article.</small>
          </>
        ) : (
          <p className="admin-help">Aucune catégorie n’est créée. <Link href="/admin/categories">Créer une première catégorie</Link>.</p>
        )}
        {categories.length > 0 && <small><Link href="/admin/categories">Gérer les catégories</Link></small>}
      </div>
      <div className="admin-editor-row">
        <div className="admin-field">
          <label htmlFor="article-status">Statut éditorial</label>
          <select id="article-status" name="status" defaultValue={article?.status ?? "DRAFT"}>
            <option value="DRAFT">Brouillon</option>
            <option value="IN_REVIEW">À relire</option>
            <option value="SCHEDULED">Programmé</option>
            <option value="PUBLISHED">Publié</option>
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="article-published-at">Date de publication</label>
          <input id="article-published-at" name="publishedAt" type="datetime-local" defaultValue={article?.publishedAt} />
          <small>Requise pour une publication programmée.</small>
        </div>
      </div>
      {state.error && <p className="admin-error" role="alert">{state.error}</p>}
      <div className="admin-form-actions">
        <button className="admin-primary" type="submit" disabled={pending}>
          <Save size={16} aria-hidden="true" /> {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
