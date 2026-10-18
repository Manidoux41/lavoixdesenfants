import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found" id="contenu">
      <span className="not-found-code">404 / PAGE INTROUVABLE</span>
      <h1>Cette page<br /><em>n’existe pas.</em></h1>
      <p>Le lien a peut-être changé ou la page a été retirée.</p>
      <Link className="button button-dark" href="/"><ArrowLeft size={16} aria-hidden="true" /> Revenir à l’accueil</Link>
    </main>
  );
}
