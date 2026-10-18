"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DEFAULT_HERO_VIDEO_ID } from "@/lib/site-settings";
import { extractYouTubeVideoId } from "@/lib/youtube-video";

export type SiteSettingsFormState = { error?: string; success?: string };

export async function saveHeroVideoAction(
  _previousState: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  const user = await requireAdminUser();
  if (user.role !== "ADMIN") {
    throw new Error("Administrator role required to update site settings.");
  }

  const rawValue = formData.get("videoUrl");
  const enabledValue = formData.get("videoEnabled");
  if (typeof rawValue !== "string" || rawValue.length > 500) {
    return { error: "Saisissez une adresse YouTube valide." };
  }
  if (enabledValue !== "on" && enabledValue !== null) {
    return { error: "État de la vidéo invalide." };
  }

  const normalizedValue = rawValue.trim();
  const enabled = enabledValue === "on";
  const submittedVideoId = normalizedValue === "" ? null : extractYouTubeVideoId(normalizedValue);
  if (enabled && submittedVideoId === null) {
    return { error: "Utilisez une URL YouTube valide pour activer la vidéo." };
  }

  const current = await db.siteSettings.findUnique({
    where: { id: "main" },
    select: { values: true },
  });
  const existingValues =
    current?.values !== null
    && current?.values !== undefined
    && typeof current.values === "object"
    && !Array.isArray(current.values)
      ? current.values
      : {};
  const previousVideoId = existingValues.heroVideoId;
  const videoId = submittedVideoId
    ?? (typeof previousVideoId === "string" && /^[A-Za-z0-9_-]{11}$/.test(previousVideoId)
      ? previousVideoId
      : DEFAULT_HERO_VIDEO_ID);
  const values: Prisma.InputJsonObject = {
    ...existingValues,
    heroVideoEnabled: enabled,
    heroVideoId: videoId,
  };

  await db.siteSettings.upsert({
    where: { id: "main" },
    create: { values },
    update: { values },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return {
    success: enabled
      ? "La vidéo d’arrière-plan est activée et son réglage a été enregistré."
      : "La vidéo d’arrière-plan est désactivée.",
  };
}
