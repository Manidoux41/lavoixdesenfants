import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contacter Cassandra Begot à Vienne",
  description: "Contacter La Voix des enfants placés à Vienne, association fondée par Cassandra Begot. Coordonnées WhatsApp et e-mail.",
  alternates: { canonical: "/contact" },
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
          <div className="contact-detail"><MessageCircle size={18} aria-hidden="true" /><span>WhatsApp uniquement : <a href="https://wa.me/33749467509" rel="noreferrer" target="_blank">07 49 46 75 09</a></span></div>
          <div className="contact-detail"><Mail size={18} aria-hidden="true" /><span>Courriel : <a href="mailto:begotcassandra2@gmail.com">begotcassandra2@gmail.com</a></span></div>
          <div className="contact-detail"><MapPin size={18} aria-hidden="true" /><span>Association à Vienne (38200), Isère.</span></div>
          <p className="contact-security-note">Pour protéger votre vie privée, ne transmettez pas de décision judiciaire ni de renseignement sensible sur un enfant par courriel ou WhatsApp. Contactez d’abord l’association afin de convenir, si nécessaire, d’un moyen adapté.</p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
