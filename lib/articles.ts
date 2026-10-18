import "server-only";

import { ArticleStatus, Prisma } from "@prisma/client";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { demoArticles } from "@/lib/demo-articles";

const articleCardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  coverImageAlt: true,
  publishedAt: true,
  categories: { select: { name: true, slug: true } },
} satisfies Prisma.ArticleSelect;

export type ArticleCardData = Prisma.ArticleGetPayload<{
  select: typeof articleCardSelect;
}>;

export async function getLatestArticles(limit = 5) {
  if (!process.env.DATABASE_URL) return demoArticles.slice(0, limit);
  await connection();

  return db.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
      archivedAt: null,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: articleCardSelect,
  });
}

export async function getPublishedArticles({
  query,
  category,
  page,
  pageSize = 9,
}: {
  query: string;
  category: string;
  page: number;
  pageSize?: number;
}) {
  if (!process.env.DATABASE_URL) {
    const matchingArticles = demoArticles.filter((article) => {
      const matchesQuery = !query
        || article.title.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"))
        || article.excerpt.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"));
      const matchesCategory = !category || article.categories.some((item) => item.slug === category);
      return matchesQuery && matchesCategory;
    });
    const categories = demoArticles.flatMap((article) => article.categories)
      .filter((item, index, all) => all.findIndex((candidate) => candidate.slug === item.slug) === index)
      .map(({ name, slug }) => ({ name, slug }));

    return {
      articles: matchingArticles.slice((page - 1) * pageSize, page * pageSize),
      categories,
      total: matchingArticles.length,
      isDemo: true,
    };
  }
  await connection();

  const where: Prisma.ArticleWhereInput = {
    status: ArticleStatus.PUBLISHED,
    publishedAt: { lte: new Date() },
    archivedAt: null,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { categories: { some: { slug: category } } } : {}),
  };

  const [articles, total, categories] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: articleCardSelect,
    }),
    db.article.count({ where }),
    db.category.findMany({
      where: { articles: { some: { status: ArticleStatus.PUBLISHED, publishedAt: { lte: new Date() }, archivedAt: null } } },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: { name: true, slug: true },
    }),
  ]);

  return { articles, categories, total, isDemo: false };
}

export async function getPublishedArticleBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    const article = demoArticles.find((item) => item.slug === slug);
    if (!article) return null;

    const timestamp = article.publishedAt;
    return {
      ...article,
      author: { name: null },
      tags: [],
      seoTitle: null,
      seoDescription: null,
      ogImageUrl: null,
      status: ArticleStatus.PUBLISHED,
      archivedAt: null,
      authorId: "demo",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
  await connection();

  return db.article.findFirst({
    where: {
      slug,
      status: ArticleStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
      archivedAt: null,
    },
    include: {
      author: { select: { name: true } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });
}

export async function getRelatedArticles(slug: string, categorySlugs: string[]) {
  if (categorySlugs.length === 0) return [];
  if (!process.env.DATABASE_URL) {
    return demoArticles.filter((article) =>
      article.slug !== slug && article.categories.some((category) => categorySlugs.includes(category.slug)),
    ).slice(0, 3);
  }
  await connection();

  return db.article.findMany({
    where: {
      slug: { not: slug },
      status: ArticleStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
      archivedAt: null,
      categories: { some: { slug: { in: categorySlugs } } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: articleCardSelect,
  });
}
