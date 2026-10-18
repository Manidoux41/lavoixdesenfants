import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandSymbol } from "@/components/brand-symbol";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="brand brand-light" href="/">
            <BrandSymbol className="brand-mark" />
            <span className="brand-name">
              <strong>La Voix</strong>
              <span>des Enfants Placés</span>
            </span>
          </Link>
          <p>
            Écouter les familles, encourager le dialogue et faciliter l’accès aux droits.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">Découvrir</span>
            <Link href="/association">L’association</Link>
            <Link href="/actions">Nos actions</Link>
            <Link href="/actualites">Actualités</Link>
          </div>
          <div>
            <span className="footer-label">S’informer</span>
            <Link href="/ressources">Ressources utiles</Link>
            <Link href="/temoignages">Témoignages</Link>
            <Link href="/agir">Agir et soutenir</Link>
          </div>
          <div>
            <span className="footer-label">Nous écrire</span>
            <Link href="/contact" className="footer-contact">
              Contacter l’association <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <span className="footer-note">Vienne (38200)</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>La Voix des Enfants Placés · Vienne (38200)</span>
        <div>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
        <span className="footer-location">Vienne · Isère</span>
      </div>
    </footer>
  );
}
