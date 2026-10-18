"use server";

import { ArticleStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin-auth";
import { publicationDate } from "@/lib/publication";

export type ArticleFormState = { error?: string };

const statuses = ["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED"] as const;

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(10).max(320),
  content: z.string().trim().min(1).max(100_000),
  coverImageUrl: z.enum([
    "",
    "/images/family-silhouettes.jpg",
    "/images/support-community.jpg",
    "/images/access-to-information.jpg",
    "/images/parent-child-together.jpg",
    "/images/father-child-walk.jpg",
    "/images/parent-child-shoreline.jpg",
    "/images/mother-child-distance.jpg",
  ]),
  coverImageAlt: z.string().trim().max(250),
  status: z.enum(statuses),
  publishedAt: z.string().max(40),
  categoryIds: z.array(z.string().min(1).max(64)).max(20),
})
  .refine(
    ({ publishedAt }) => !publishedAt || !Number.isNaN(new Date(publishedAt).getTime()),
    { path: ["publishedAt"], message: "Date de publication invalide." },
  )
  .refine(({ coverImageUrl, coverImageAlt }) => !coverImageUrl || coverImageAlt.length > 0, {
    path: ["coverImageAlt"],
    message: "Ajoutez un texte alternatif à l’image de couverture.",
  });

function parseArticle(formData: FormData) {
  return articleSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    coverImageAlt: formData.get("coverImageAlt") ?? "",
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt") ?? "",
    categoryIds: formData.getAll("categoryIds").filter((value): value is string => typeof value === "string"),
  });
}

function mapUniqueError(error: unknown): ArticleFormState | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { error: "Ce slug est déjà utilisé. Choisissez une URL différente." };
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return { error: "Une catégorie sélectionnée n’existe plus. Actualisez la page et réessayez." };
  }
  return null;
}

function revalidateEditorialPages() {
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
}

export async function createArticleAction(
  _previousState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const user = await requireAdminUser();
  const parsed = parseArticle(formData);
  if (!parsed.success) return { error: "Vérifiez les champs. Le slug doit contenir des lettres minuscules, chiffres et tirets." };
  const publication = publicationDate(parsed.data.status, parsed.data.publishedAt);
  if (publication.error) return { error: publication.error };

  let articleId: string;
  try {
    const article = await db.article.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl || null,
        coverImageAlt: parsed.data.coverImageUrl ? parsed.data.coverImageAlt : null,
        status: parsed.data.status,
        publishedAt: publication.date,
        authorId: user.id,
        categories: { connect: parsed.data.categoryIds.map((id) => ({ id })) },
      },
      select: { id: true },
    });
    articleId = article.id;
  } catch (error) {
    const mapped = mapUniqueError(error);
    if (mapped) return mapped;
    throw error;
  }

  revalidateEditorialPages();
  redirect(`/admin/articles/${articleId}/edit`);
}

export async function updateArticleAction(
  _previousState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await requireAdminUser();
  const parsed = parseArticle(formData);
  if (!parsed.success || !parsed.data.id) {
    return { error: "Vérifiez les champs requis et réessayez." };
  }
  const publication = publicationDate(parsed.data.status, parsed.data.publishedAt);
  if (publication.error) return { error: publication.error };

  try {
    await db.article.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl || null,
        coverImageAlt: parsed.data.coverImageUrl ? parsed.data.coverImageAlt : null,
        status: parsed.data.status,
        publishedAt: publication.date,
        archivedAt: null,
        categories: {
          set: parsed.data.categoryIds.map((id) => ({ id })),
        },
      },
    });
  } catch (error) {
    const mapped = mapUniqueError(error);
    if (mapped) return mapped;
    throw error;
  }

  revalidateEditorialPages();
  redirect(`/admin/articles/${parsed.data.id}/edit?saved=1`);
}

export async function archiveArticleAction(formData: FormData) {
  await requireAdminUser();
  const id = z.string().min(1).max(64).parse(formData.get("id"));
  await db.article.update({
    where: { id },
    data: { status: ArticleStatus.ARCHIVED, archivedAt: new Date() },
  });
  revalidateEditorialPages();
}

export async function restoreArticleAction(formData: FormData) {
  await requireAdminUser();
  const id = z.string().min(1).max(64).parse(formData.get("id"));
  const article = await db.article.findUniqueOrThrow({
    where: { id, status: ArticleStatus.ARCHIVED },
    select: { publishedAt: true },
  });
  const status = article.publishedAt && article.publishedAt <= new Date()
    ? ArticleStatus.PUBLISHED
    : ArticleStatus.DRAFT;
  await db.article.update({
    where: { id },
    data: { status, archivedAt: null },
  });
  revalidateEditorialPages();
}

export async function deleteArticleAction(formData: FormData) {
  const user = await requireAdminUser();
  if (user.role !== "ADMIN") throw new Error("Administrator role required to permanently delete articles.");
  const id = z.string().min(1).max(64).parse(formData.get("id"));
  await db.article.delete({ where: { id } });
  revalidateEditorialPages();
}
