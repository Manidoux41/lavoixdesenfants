import { readFile } from "node:fs/promises";
import { ArticleStatus, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const articles = JSON.parse(
    await readFile(new URL("../content/association-articles.json", import.meta.url), "utf8"),
  );
  const author = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!author) {
    throw new Error("Create an administrator first with `npm run admin:create`.");
  }

  const categories = new Map();
  for (const article of articles) {
    if (categories.has(article.categorySlug)) continue;
    const category = await prisma.category.upsert({
      where: { slug: article.categorySlug },
      create: {
        name: article.category,
        slug: article.categorySlug,
        description: `Articles sur le thème « ${article.category} ».`,
      },
      update: {},
      select: { id: true },
    });
    categories.set(article.categorySlug, category.id);
  }

  let created = 0;
  let preserved = 0;
  for (const article of articles) {
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
      select: { id: true },
    });
    if (existing) {
      preserved += 1;
      continue;
    }

    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content.join("\n\n"),
        coverImageUrl: article.coverImageUrl,
        coverImageAlt: article.coverImageAlt,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: author.id,
        categories: { connect: [{ id: categories.get(article.categorySlug) }] },
      },
    });
    created += 1;
  }

  console.log(`Imported ${created} association articles. Preserved ${preserved} existing articles without overwriting them.`);
} finally {
  await prisma.$disconnect();
}
