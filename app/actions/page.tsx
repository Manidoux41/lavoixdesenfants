import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Ear, MessagesSquare } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Nos actions",
  description: "Écoute, dialogue et accès à l’information : les engagements de l’association.",
};

const actions = [
  {
    index: "A",
    icon: Ear,
    title: "Accueillir la parole",
    text: "Porter attention aux expériences des parents et des enfants concernés, dans le respect de leur dignité et de leur vie privée.",
  },
  {
    index: "B",
    icon: BookOpen,
    title: "Encourager l’information",
    text: "Orienter vers des repères et ressources utiles pour mieux comprendre les démarches et les droits.",
  },
  {
    index: "C",
    icon: MessagesSquare,
    title: "Favoriser le dialogue",
    text: "Promouvoir des échanges constructifs et la recherche de réponses adaptées à l’intérêt de l’enfant.",
  },
];

export default function ActionsPage() {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Nos engagements"
        title="Écouter, informer, faire avancer."
        description="Des engagements qui partent des besoins exprimés par les familles. Les actions opérationnelles sont présentées ici uniquement lorsqu’elles sont confirmées par l’association."
      />
      <section className="actions-list">
        {actions.map(({ index, icon: Icon, title, text }) => (
          <article className="action-row" key={index}>
            <span className="action-index">{index}</span>
            <Icon className="action-icon" size={26} strokeWidth={1.5} aria-hidden="true" />
            <div className="action-copy">
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <span className="action-status">ENGAGEMENT</span>
          </article>
        ))}
      </section>
      <section className="action-callout">
        <p className="eyebrow eyebrow-light"><span className="eyebrow-mark" />Une question sur nos actions ?</p>
        <h2>La conversation<br />commence par <em>l’écoute.</em></h2>
        <Link className="button button-red" href="/contact">
          Écrire à l’association <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
