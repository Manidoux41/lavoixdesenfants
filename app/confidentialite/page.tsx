import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Informations sur les données personnelles traitées par le site.",
};

export default function PrivacyPage() {
  return (
    <main className="page-main legal-page" id="contenu">
      <PageHeading
        eyebrow="Données personnelles"
        title="Votre vie privée compte."
        description="Cette notice décrit le fonctionnement prévu du formulaire et doit être relue par l’association avant mise en production."
      />
      <div className="legal-content">
        <section><h2>Formulaire de contact</h2><p>Le formulaire demande un nom ou pseudonyme, une adresse e-mail, un objet et un message afin de permettre à l’association de répondre. Ne transmettez pas de pièces judiciaires ni de renseignements sensibles concernant un enfant.</p></section>
        <section><h2>Transmission du message</h2><p>Lorsque le formulaire est activé, le message est transmis par le prestataire d’envoi de courriels configuré par l’association. Le site ne conserve pas de copie du message dans sa base de données.</p></section>
        <section><h2>Durée de conservation et droits</h2><p>La durée de conservation des courriels, l’identité du responsable de traitement et les modalités d’exercice des droits doivent être définies et complétées par l’association avant la mise en production.</p></section>
        <section><h2>Cookies</h2><p>Le site ne met pas en place de cookies publicitaires ou de mesure d’audience dans cette version.</p></section>
      </div>
      <p className="legal-warning">Notice à vérifier et compléter avec le responsable de traitement de l’association.</p>
    </main>
  );
}
