import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { BrandSymbol } from "@/components/brand-symbol";

const navigation = [
  { href: "/association", label: "L’association" },
  { href: "/actions", label: "Nos actions" },
  { href: "/actualites", label: "Actualités" },
  { href: "/ressources", label: "Ressources" },
  { href: "/temoignages", label: "Témoignages" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="La Voix des Enfants Placés, accueil">
          <BrandSymbol className="brand-mark" />
          <span className="brand-name">
            <strong>La Voix</strong>
            <span>des Enfants Placés</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <Link className="header-contact" href="/contact">
          Nous contacter <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>

        <details className="mobile-nav">
          <summary aria-label="Ouvrir le menu">
            <Menu size={23} aria-hidden="true" />
          </summary>
          <nav aria-label="Navigation mobile">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
            <Link href="/agir">Agir et soutenir</Link>
            <Link href="/contact">Nous contacter</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
