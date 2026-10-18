"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin-auth";
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

export async function createCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdminUser();
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

  revalidatePath("/admin/categories");
  return { success: "Catégorie créée. Elle est maintenant disponible dans l’éditeur d’articles." };
}
