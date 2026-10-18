import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Témoignages",
  description: "Une parole partagée uniquement avec accord et après validation.",
};

export default function TestimonialsPage() {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Paroles & vécus"
        title="Raconter, seulement si l’on choisit."
        description="Chaque histoire appartient à la personne qui la vit. Aucune parole n’est publiée sans accord explicite et examen attentif de la vie privée."
      />
      <section className="testimony-note">
        <div className="testimony-note-icon"><LockKeyhole size={23} aria-hidden="true" /></div>
        <div>
          <p className="eyebrow"><span className="eyebrow-mark" />Respect et consentement d’abord</p>
          <h2>Pas de témoignage<br /><em>sans autorisation.</em></h2>
          <p>
            Les récits peuvent contenir des détails personnels ou permettre d’identifier un enfant. Ils ne sont donc jamais publiés automatiquement et ne sont pas sollicités par un formulaire public sur cette page.
          </p>
          <p className="notice-inline">
            Aucun témoignage n’a été publié dans cette rubrique à ce jour.
          </p>
          <Link className="text-link" href="/contact">
            Poser une question à l’association <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <span className="testimony-watermark" aria-hidden="true">“</span>
      </section>
    </main>
  );
}
