import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire à l’association La Voix des Enfants Placés à Vienne.",
};

export default function ContactPage() {
  return (
    <main className="page-main" id="contenu">
      <PageHeading
        eyebrow="Échangeons"
        title="Nous sommes à l’écoute."
        description="Une question, une information à partager ou simplement l’envie de prendre contact ? Écrivez-nous."
      />
      <section className="contact-layout">
        <div className="contact-aside">
          <p className="eyebrow"><span className="eyebrow-mark" />Prendre contact</p>
          <h2>Un premier<br /><em>message.</em></h2>
          <p>Vous pouvez nous écrire via ce formulaire. Seules les informations nécessaires à la réponse sont demandées.</p>
          <div className="contact-detail"><Mail size={18} aria-hidden="true" /><span>Votre message sera transmis à l’association par courriel.</span></div>
          <div className="contact-detail"><MapPin size={18} aria-hidden="true" /><span>Association à Vienne (38200), Isère.</span></div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
