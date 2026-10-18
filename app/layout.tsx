import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://www.association-la-voix-des-enfants-places-a-vienne-38200.fr",
  ),
  title: {
    default: "La Voix des Enfants Placés — Vienne (38200)",
    template: "%s — La Voix des Enfants Placés",
  },
  description:
    "Association à Vienne (Isère) : encourager le dialogue, l’accès aux droits et la recherche de solutions adaptées à l’intérêt de l’enfant.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "La Voix des Enfants Placés",
    title: "La Voix des Enfants Placés — Vienne (38200)",
    description:
      "Écouter les familles, encourager le dialogue et faciliter l’accès aux droits.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
