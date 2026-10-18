import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, HandHeart, Mail, Megaphone } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Agir et soutenir",
  description: "Prendre contact avec l’association pour connaître les possibilités de participation.",
};

export default function ActPage() {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Agir ensemble"
        title="Chaque soutien commence par une rencontre."
        description="Les modalités d’adhésion, de bénévolat ou de soutien doivent être confirmées par l’association avant d’être présentées."
      />
      <section className="support-grid">
        <article><HandHeart size={25} strokeWidth={1.5} aria-hidden="true" /><span className="resource-tag">PARTICIPER</span><h2>Vous souhaitez vous engager ?</h2><p>Écrivez-nous pour échanger sur les possibilités de participation aux actions de l’association.</p></article>
        <article><Megaphone size={25} strokeWidth={1.5} aria-hidden="true" /><span className="resource-tag">FAIRE CONNAÎTRE</span><h2>Relayer une information</h2><p>Les actualités et ressources publiées ici pourront être partagées pour faire circuler une information utile.</p></article>
        <article><Mail size={25} strokeWidth={1.5} aria-hidden="true" /><span className="resource-tag">PRENDRE CONTACT</span><h2>Parlons-en</h2><p>Le moyen le plus simple pour le moment est de prendre contact et de préciser votre proposition.</p></article>
      </section>
      <div className="support-notice">
        <p>Aucun montant de cotisation, RIB, paiement ou campagne d’appel aux dons n’est publié ici sans validation de l’association.</p>
        <Link className="button button-dark" href="/contact">Contacter l’association <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
