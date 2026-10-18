export type DemoArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publishedAt: Date;
  categories: { id: string; name: string; slug: string }[];
};

export const demoArticles: DemoArticle[] = [
  {
    id: "demo-liens-familiaux",
    title: "Préserver les liens familiaux pendant un placement",
    slug: "demo-preserver-les-liens-familiaux",
    excerpt: "Des repères généraux pour préparer les échanges et garder une place au dialogue autour de l’enfant.",
    content: `Chaque situation familiale est singulière. Cet article de démonstration propose des pistes générales de réflexion et ne remplace ni un accompagnement adapté, ni un conseil juridique ou professionnel.\n\nQuand un enfant est placé, les modalités de contacts avec ses parents et ses proches sont définies dans un cadre propre à sa situation. Pour toute question sur les droits de visite ou les échanges, rapprochez-vous du service référent ou du professionnel qui accompagne la famille.\n\nPréparer ses questions à l’avance, demander des explications lorsque quelque chose n’est pas clair et noter les informations utiles peut faciliter le dialogue avec les interlocuteurs concernés.\n\nCet exemple ne décrit pas une situation réelle et ne constitue pas une publication officielle de l’association.`,
    coverImageUrl: "/images/family-silhouettes.jpg",
    coverImageAlt: "Silhouettes d’adultes et d’enfants vues de dos, réunies au bord de l’eau ; illustration générique.",
    publishedAt: new Date("2026-10-18T09:00:00.000Z"),
    categories: [{ id: "demo-category-family", name: "Liens familiaux", slug: "liens-familiaux" }],
  },
  {
    id: "demo-preparer-rencontre",
    title: "Préparer une rencontre et poser ses questions",
    slug: "demo-preparer-une-rencontre",
    excerpt: "Quelques idées pour organiser les points à aborder lors d’un rendez-vous avec un professionnel.",
    content: `Un rendez-vous peut être l’occasion de mieux comprendre les prochaines étapes et de partager les questions qui comptent pour la famille. Cet article fictif donne des repères généraux ; il ne remplace pas l’avis d’un professionnel.\n\nAvant la rencontre, il peut être utile de noter les sujets prioritaires, les dates importantes et les points qui restent à éclaircir. Une liste courte aide à ne pas perdre de vue les questions essentielles.\n\nPendant l’échange, demander à reformuler une information ou à préciser qui contacter ensuite est légitime. Après le rendez-vous, noter les démarches convenues peut aider à garder un fil.\n\nLes procédures varient selon les situations. Pour une réponse adaptée, adressez-vous au service compétent ou à un professionnel qualifié. Ce contenu est fourni uniquement comme exemple de présentation.`,
    coverImageUrl: "/images/access-to-information.jpg",
    coverImageAlt: "Deux personnes consultent ensemble un document ; illustration générique.",
    publishedAt: new Date("2026-10-16T09:00:00.000Z"),
    categories: [{ id: "demo-category-guides", name: "Repères & droits", slug: "reperes-droits" }],
  },
  {
    id: "demo-ecouter-enfant",
    title: "Faire une place à la parole de l’enfant",
    slug: "demo-parole-de-lenfant",
    excerpt: "Un rappel général : écouter avec attention, respecter le rythme de l’enfant et solliciter les bons interlocuteurs.",
    content: `La parole d’un enfant mérite d’être accueillie avec attention et sans pression. Les besoins, l’âge et le vécu de chaque enfant sont différents.\n\nLes adultes peuvent lui laisser le temps de s’exprimer, employer des mots qu’il comprend et éviter de lui demander de choisir entre ses proches. Si une préoccupation apparaît, il est préférable de la partager avec le professionnel qui accompagne l’enfant.\n\nCet article est un contenu fictif de démonstration. Il ne décrit aucune famille accompagnée et ne fournit pas de conseil clinique ou juridique.`,
    coverImageUrl: "/images/parent-child-shoreline.jpg",
    coverImageAlt: "Un adulte et un enfant marchent ensemble au bord de l’eau, vus en silhouette ; illustration générique.",
    publishedAt: new Date("2026-10-14T09:00:00.000Z"),
    categories: [{ id: "demo-category-child-voice", name: "Parole de l’enfant", slug: "parole-enfant" }],
  },
];
