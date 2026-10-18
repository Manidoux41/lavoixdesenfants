import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales du site de La Voix des Enfants Placés.",
};

export default function LegalPage() {
  return (
    <main className="page-main legal-page" id="contenu">
      <PageHeading
        eyebrow="Informations légales"
        title="Mentions légales."
        description="Cette page doit être complétée et vérifiée par l’association avant la mise en production."
      />
      <div className="legal-content">
        <section><h2>Éditeur du site</h2><p>La Voix des Enfants Placés à Vienne (38200).</p><p>Nom légal complet, adresse du siège, numéro d’immatriculation et coordonnées de l’association : <strong>à confirmer par les responsables de l’association.</strong></p></section>
        <section><h2>Direction de la publication</h2><p>Identité du ou de la responsable de publication : <strong>à renseigner après validation par l’association.</strong></p></section>
        <section><h2>Hébergement</h2><p>Hébergeur, adresse et coordonnées : <strong>à compléter avant publication du site.</strong></p></section>
        <section><h2>Propriété intellectuelle</h2><p>Les contenus et éléments graphiques de ce site doivent être utilisés dans le respect des droits de leurs auteurs et des autorisations obtenues.</p></section>
      </div>
      <p className="legal-warning">Ne pas considérer ces mentions comme complètes pour une mise en production.</p>
    </main>
  );
}
