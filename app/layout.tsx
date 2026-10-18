import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://la-voix-des-enfants-places-vienne.vercel.app",
  ),
  title: {
    default: "Cassandra Begot | La Voix des enfants placés à Vienne",
    template: "%s — La Voix des Enfants Placés",
  },
  description:
    "La Voix des enfants placés à Vienne, fondée par Cassandra Begot : écoute des familles, droits de l’enfant et accompagnement associatif en Isère.",
  applicationName: "La Voix des enfants placés à Vienne",
  keywords: [
    "Cassandra Begot",
    "La Voix des enfants placés à Vienne",
    "association protection de l’enfance Vienne",
    "droits des enfants placés",
    "accompagnement des familles",
    "protection de l’enfance Isère",
  ],
  authors: [{ name: "La Voix des enfants placés à Vienne" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Cassandra Begot | La Voix des enfants placés à Vienne",
    description:
      "Association à Vienne fondée par Cassandra Begot : écouter les familles et défendre les droits de l’enfant.",
    url: "/",
    siteName: "La Voix des enfants placés à Vienne",
  },
  twitter: {
    card: "summary",
    title: "Cassandra Begot | La Voix des enfants placés à Vienne",
    description: "Association de soutien aux familles et de défense des droits des enfants à Vienne, en Isère.",
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
        <Analytics />
      </body>
    </html>
  );
}
