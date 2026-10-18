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
        title="Défendre les enfants. Accompagner les familles."
        description="La Voix des enfants placés à Vienne est une association engagée pour les droits des enfants, le soutien aux familles et l’évolution de la protection de l’enfance."
      />
      <section className="editorial-split">
        <div className="editorial-index"><span>01</span><span>NOTRE MISSION</span></div>
        <div className="editorial-copy">
          <h2>Une association<br />engagée et <em>à l’écoute.</em></h2>
          <p>
            Fondée et présidée par Cassandra Begot, l’association est située à Vienne (38200), en Isère. Elle donne une place à la parole des enfants et des parents, accompagne les familles dans leurs démarches et porte des propositions pour faire évoluer les pratiques.
          </p>
          <p>
            Elle défend une protection plus humaine et transparente, centrée sur les besoins de chaque enfant et attentive aux droits des familles et aux liens familiaux lorsque leur maintien correspond à l’intérêt de l’enfant.
          </p>
          <p><strong>Cassandra Begot — Fondatrice et présidente de l’association.</strong></p>
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
          Pour découvrir l’accompagnement proposé, les orientations possibles et les propositions portées par l’association, consultez les <Link href="/actualites">articles et repères</Link> ou contactez-nous.
        </p>
      </section>
    </main>
  );
}
