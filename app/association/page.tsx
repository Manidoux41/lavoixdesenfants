import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "L’association",
  description: "La mission et les engagements de La Voix des Enfants Placés à Vienne.",
};

const commitments = [
  {
    icon: MessageCircle,
    title: "Écoute et dialogue",
    text: "Créer les conditions d’un échange attentif entre les familles et les acteurs concernés.",
  },
  {
    icon: ShieldCheck,
    title: "Accès aux droits",
    text: "Encourager l’information et l’orientation vers les ressources compétentes.",
  },
  {
    icon: Heart,
    title: "Intérêt de l’enfant",
    text: "Garder au centre la recherche de solutions adaptées à l’intérêt de l’enfant.",
  },
];

export default function AssociationPage() {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Qui sommes-nous"
        title="Une voix pour écouter. Un lien pour avancer."
        description="À Vienne, l’association porte la parole des parents et des enfants placés et encourage le dialogue, l’accès aux droits et la recherche de solutions adaptées à l’intérêt de l’enfant."
      />
      <section className="editorial-split">
        <div className="editorial-index"><span>01</span><span>NOTRE MISSION</span></div>
        <div className="editorial-copy">
          <h2>Faire une place<br />à chaque <em>parole.</em></h2>
          <p>
            Certaines familles estiment être confrontées à des décisions injustes ou à des dysfonctionnements de l’Aide sociale à l’enfance. L’association souhaite leur offrir un espace d’écoute et soutenir le dialogue.
          </p>
          <p>
            Son engagement est de faciliter l’accès à l’information et de rechercher, avec les personnes concernées, des réponses adaptées à l’intérêt de l’enfant.
          </p>
          <Link className="text-link" href="/actions">
            Découvrir nos actions <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="editorial-visual" aria-hidden="true">
          <span className="visual-circle visual-circle-large" />
          <span className="visual-circle visual-circle-small" />
          <span className="visual-visual-word">ÉCOUTER<br /><em>ENSEMBLE</em></span>
          <span className="visual-caption">VIENNE · 38</span>
        </div>
      </section>
      <section className="commitments-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" />Nos principes</p>
            <h2>Une démarche<br /><em>à visage humain.</em></h2>
          </div>
          <p className="section-intro">
            Écouter sans promettre de solution toute faite. Informer sans remplacer les professionnels du droit ou de l’accompagnement.
          </p>
        </div>
        <div className="commitment-grid">
          {commitments.map(({ icon: Icon, title, text }, index) => (
            <article className="commitment-card" key={title}>
              <span className="commitment-number">0{index + 1}</span>
              <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="notice-strip">
        <span className="notice-symbol" aria-hidden="true">i</span>
        <p>
          Les informations détaillées sur l’histoire, les responsables, le siège et les activités précises de l’association seront complétées après vérification par ses représentants.
        </p>
      </section>
    </main>
  );
}
