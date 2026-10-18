import type { Metadata } from "next";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Ressources et droits",
  description: "Liens vers des ressources publiques et organismes compétents.",
};

const resources = [
  {
    tag: "DÉFENSE DES DROITS",
    title: "Le Défenseur des droits",
    description: "S’informer sur les droits de l’enfant et les moyens de saisir le Défenseur des droits.",
    href: "https://www.defenseurdesdroits.fr/",
    source: "defenseurdesdroits.fr",
  },
  {
    tag: "INFORMATION PUBLIQUE",
    title: "Service-Public.fr",
    description: "Consulter les informations administratives et les démarches officielles publiées par l’État.",
    href: "https://www.service-public.fr/",
    source: "service-public.fr",
  },
  {
    tag: "PROTECTION DE L’ENFANCE",
    title: "Le 119 — Enfance en danger",
    description: "Le numéro national dédié à la prévention et à la protection des enfants en danger ou en risque de l’être.",
    href: "https://www.allo119.gouv.fr/",
    source: "allo119.gouv.fr",
  },
];

export default function ResourcesPage() {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Ressources & droits"
        title="Des repères fiables pour s’informer."
        description="Des liens vers des sources publiques. Ces ressources générales ne remplacent pas un avis juridique personnalisé ni l’accompagnement d’un professionnel."
      />
      <section className="resource-list" aria-label="Ressources vérifiées">
        {resources.map((resource, index) => (
          <article className="resource-item" key={resource.href}>
            <span className="resource-item-number">0{index + 1}</span>
            <div className="resource-item-copy">
              <span className="resource-tag">{resource.tag}</span>
              <h2><a href={resource.href} target="_blank" rel="noreferrer">{resource.title}<ExternalLink size={17} aria-label="(s’ouvre dans un nouvel onglet)" /></a></h2>
              <p>{resource.description}</p>
            </div>
            <a className="resource-source" href={resource.href} target="_blank" rel="noreferrer">
              <span>{resource.source}</span><ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </article>
        ))}
      </section>
      <p className="resource-review-note">
        Liens consultés lors de la création de cette rubrique. Leur contenu peut évoluer : vérifiez toujours la date et la source de l’information.
      </p>
    </main>
  );
}
