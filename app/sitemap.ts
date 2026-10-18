import type { MetadataRoute } from "next";
import { ArticleStatus } from "@prisma/client";
import { connection } from "next/server";
import { db } from "@/lib/db";

const staticRoutes = [
  "",
  "/association",
  "/actions",
  "/actualites",
  "/temoignages",
  "/ressources",
  "/agir",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://la-voix-des-enfants-places-vienne.vercel.app"
  ).replace(/\/+$/, "");
  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "/actualites" ? "daily" as const : "monthly" as const,
    priority: route === "" ? 1 : route === "/association" || route === "/contact" ? 0.9 : 0.7,
  }));

  if (!process.env.DATABASE_URL) return routes;
  await connection();

  const articles = await db.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
      archivedAt: null,
    },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...routes,
    ...articles.map((article) => ({
      url: `${baseUrl}/actualites/${article.slug}`,
      lastModified: article.updatedAt,
    })),
  ];
}
