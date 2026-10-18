"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FilePlus2,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useState } from "react";

const sections = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "articles", label: "Articles", icon: FilePlus2 },
  { id: "categories", label: "Catégories", icon: FolderOpen },
  { id: "media", label: "Médiathèque", icon: ImageIcon },
  { id: "testimonials", label: "Témoignages", icon: MessageSquare },
  { id: "settings", label: "Réglages", icon: Settings },
] as const;

type DemoSection = (typeof sections)[number]["id"];

const articles = [
  { title: "Comprendre les étapes d’un accompagnement", category: "Repères & droits", status: "Publié", style: "status-published", date: "18 oct. 2026" },
  { title: "Préserver le dialogue autour de l’enfant", category: "Liens familiaux", status: "À relire", style: "status-in_review", date: "16 oct. 2026" },
  { title: "Trouver les bons interlocuteurs", category: "Soutien aux parents", status: "Brouillon", style: "", date: "12 oct. 2026" },
  { title: "La parole de l’enfant au cœur des échanges", category: "Parole de l’enfant", status: "Programmé", style: "status-scheduled", date: "22 oct. 2026" },
];

function SectionContent({
  section,
  onNavigate,
}: {
  section: DemoSection;
  onNavigate: (section: DemoSection) => void;
}) {
  if (section === "articles") {
    return (
      <>
        <div className="admin-page-heading">
          <div><p className="admin-kicker">CONTENUS</p><h1>Articles</h1><p>Exemple de liste éditoriale — données fictives.</p></div>
          <button className="admin-primary" type="button" disabled><FilePlus2 size={16} aria-hidden="true" /> Nouvel article</button>
        </div>
        <div className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th scope="col">Titre</th><th scope="col">Catégorie</th><th scope="col">Statut</th><th scope="col">Modifié le</th><th scope="col">Action</th></tr></thead>
              <tbody>{articles.map((article) => (
                <tr key={article.title}>
                  <th scope="row">{article.title}<small>aperçu-de-contenu</small></th>
                  <td>{article.category}</td>
                  <td><span className={`status-pill ${article.style}`}>{article.status}</span></td>
                  <td>{article.date}</td>
                  <td><button className="demo-disabled-link" type="button" disabled>Modifier</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  if (section === "categories") {
    return (
      <>
        <div className="admin-page-heading"><div><p className="admin-kicker">ORGANISATION</p><h1>Catégories</h1><p>Exemples de thèmes proposés — données fictives.</p></div><button className="admin-primary" type="button" disabled><FolderOpen size={16} aria-hidden="true" /> Ajouter une catégorie</button></div>
        <div className="demo-category-grid">
          {[
            ["Liens familiaux", "Préserver et soutenir les relations familiales.", "8 articles"],
            ["Repères & droits", "Informations et ressources pour s’orienter.", "12 articles"],
            ["Soutien aux parents", "Écoute, échanges et accompagnement.", "6 articles"],
            ["Parole de l’enfant", "Prendre en compte les besoins et les voix.", "5 articles"],
          ].map(([name, description, count]) => <article key={name}><span>{count}</span><h2>{name}</h2><p>{description}</p></article>)}
        </div>
      </>
    );
  }

  if (section === "media") {
    return (
      <>
        <div className="admin-page-heading"><div><p className="admin-kicker">IMAGES & DOCUMENTS</p><h1>Médiathèque</h1><p>Écran de démonstration, sans fichiers téléversés.</p></div><button className="admin-primary" type="button" disabled><ImageIcon size={16} aria-hidden="true" /> Importer un fichier</button></div>
        <div className="admin-panel demo-placeholder"><ImageIcon size={28} aria-hidden="true" /><h2>La médiathèque sera connectée ultérieurement</h2><p>Les fichiers et leurs textes alternatifs pourront être gérés ici une fois le stockage configuré.</p></div>
      </>
    );
  }

  if (section === "testimonials") {
    return (
      <>
        <div className="admin-page-heading"><div><p className="admin-kicker">PAROLES & CONSENTEMENTS</p><h1>Témoignages</h1><p>Aucun témoignage réel n’est affiché dans cet aperçu.</p></div></div>
        <div className="admin-panel demo-placeholder"><MessageSquare size={28} aria-hidden="true" /><h2>Modération à venir</h2><p>Cette interface permettra de vérifier les consentements et de modérer les témoignages avant publication.</p></div>
      </>
    );
  }

  if (section === "settings") {
    return (
      <>
        <div className="admin-page-heading"><div><p className="admin-kicker">CONFIGURATION</p><h1>Réglages du site</h1><p>Présentation indicative des futures préférences éditoriales.</p></div></div>
        <div className="admin-panel demo-settings"><div><span>Nom du site</span><strong>La Voix des Enfants Placés</strong></div><div><span>Adresse publique</span><strong>À configurer</strong></div><div><span>Courriel de contact</span><strong>À confirmer avec l’association</strong></div></div>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-kicker">ESPACE ÉDITORIAL · APERÇU</p><h1>Bonjour, équipe éditoriale.</h1><p>Une vue d’ensemble de l’activité du site, illustrée avec des chiffres fictifs.</p></div>
        <button className="admin-primary" type="button" disabled><FilePlus2 size={16} aria-hidden="true" /> Nouvel article</button>
      </div>
      <section className="admin-stats" aria-label="Statistiques fictives">
        <div><span>Articles publiés</span><strong>18</strong></div>
        <div><span>Brouillons</span><strong>04</strong></div>
        <div><span>À relire</span><strong>02</strong></div>
        <div><span>Catégories</span><strong>04</strong></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><h2>Dernières modifications</h2><button className="demo-panel-link" type="button" onClick={() => onNavigate("articles")}>Voir les articles <ArrowUpRight size={15} aria-hidden="true" /></button></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th scope="col">Titre</th><th scope="col">Statut</th><th scope="col">Mis à jour</th><th scope="col">Action</th></tr></thead>
            <tbody>{articles.slice(0, 3).map((article) => (
              <tr key={article.title}><th scope="row">{article.title}<small>{article.category}</small></th><td><span className={`status-pill ${article.style}`}>{article.status}</span></td><td>{article.date}</td><td><button className="demo-disabled-link" type="button" disabled>Modifier</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export function AdminDemo() {
  const [activeSection, setActiveSection] = useState<DemoSection>("dashboard");

  return (
    <main className="admin-demo-shell">
      <aside className="admin-demo-sidebar">
        <Link className="admin-brand" href="/admin/login">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>La Voix <small>Administration</small></span>
        </Link>
        <p className="admin-demo-nav-label">ESPACE DE TRAVAIL</p>
        <nav aria-label="Navigation de démonstration">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              aria-current={activeSection === id ? "page" : undefined}
              className={activeSection === id ? "active" : ""}
              key={id}
              onClick={() => setActiveSection(id)}
              type="button"
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>
        <Link className="admin-demo-back" href="/"><ArrowLeft size={15} aria-hidden="true" /> Retour au site public</Link>
      </aside>

      <div className="admin-demo-main">
        <header className="admin-demo-topbar">
          <span>Administration <span aria-hidden="true">/</span> {sections.find(({ id }) => id === activeSection)?.label}</span>
          <span className="admin-demo-avatar" aria-label="Utilisateur de démonstration">D</span>
        </header>
        <div className="admin-demo-banner" role="status">
          <strong>Mode aperçu</strong>
          <span>Données fictives · aucune modification n’est enregistrée.</span>
          <Link href="/admin/login">Connexion réelle <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
        <section className="admin-demo-content" aria-live="polite">
          <SectionContent key={activeSection} section={activeSection} onNavigate={setActiveSection} />
          <p className="admin-demo-disclaimer">Maquette visuelle uniquement. Les actions de création, modification et publication seront disponibles après connexion de la base de données.</p>
        </section>
      </div>
    </main>
  );
}
