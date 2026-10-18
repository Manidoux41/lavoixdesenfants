const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://la-voix-des-enfants-places-vienne.vercel.app"
).replace(/\/+$/, "");

const association = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#association`,
  name: "La Voix des enfants placés à Vienne",
  alternateName: "La Voix des Enfants Placés",
  url: baseUrl,
  logo: `${baseUrl}/images/logo-association.jpeg`,
  description:
    "Association fondée et présidée par Cassandra Begot à Vienne (38200), en Isère. Défense des droits des enfants, écoute et accompagnement associatif des familles concernées par la protection de l’enfance.",
  email: "begotcassandra2@gmail.com",
  telephone: "+33749467509",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vienne",
    postalCode: "38200",
    addressRegion: "Isère",
    addressCountry: "FR",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Vienne et Isère",
  },
  founder: {
    "@type": "Person",
    name: "Cassandra Begot",
    jobTitle: "Fondatrice et présidente",
    url: `${baseUrl}/association`,
    worksFor: { "@id": `${baseUrl}/#association` },
  },
  knowsAbout: [
    "Protection de l’enfance",
    "Droits de l’enfant",
    "Enfants placés",
    "Accompagnement des familles",
    "Liens familiaux",
  ],
};

export function OrganizationJsonLd() {
  const serialized = JSON.stringify(association).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialized }} />;
}
