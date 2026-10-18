"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { requireAdministrator } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export type CategoryFormState = { error?: string; success?: string };

const categorySchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(60),
  description: z.string().trim().max(180),
});

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function revalidateCategories() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
}

export async function createCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdministrator();
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Vérifiez les champs de la catégorie." };
  }

  const slug = createSlug(parsed.data.name);
  if (!slug) return { error: "Le nom ne peut pas être converti en adresse valide." };

  try {
    await db.category.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Une catégorie utilise déjà cette adresse. Choisissez un autre nom." };
    }
    throw error;
  }

  revalidateCategories();
  return { success: "Catégorie créée. Elle est maintenant disponible dans l’éditeur d’articles." };
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdministrator();
  const parsed = z.object({
    id: z.string().min(1).max(64),
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().max(180),
  }).safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) redirect("/admin/categories?error=category-invalid");

  const slug = createSlug(parsed.data.name);
  if (!slug) redirect("/admin/categories?error=category-invalid");
  try {
    await db.category.update({
      where: { id: parsed.data.id },
      data: { name: parsed.data.name, slug, description: parsed.data.description || null },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect("/admin/categories?error=category-duplicate");
    }
    throw error;
  }

  revalidateCategories();
  redirect("/admin/categories?success=category-updated");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdministrator();
  const id = z.string().min(1).max(64).parse(formData.get("id"));
  await db.category.delete({ where: { id } });
  revalidateCategories();
  redirect("/admin/categories?success=category-deleted");
}
