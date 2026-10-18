import "server-only";

import type { Prisma } from "@prisma/client";
import { connection } from "next/server";
import { db } from "@/lib/db";

export const DEFAULT_HERO_VIDEO_ID = "LnIO5TXB2X0";

export type HeroVideoSettings = {
  enabled: boolean;
  videoId: string;
};

export async function getHeroVideoSettings(): Promise<HeroVideoSettings> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return { enabled: true, videoId: DEFAULT_HERO_VIDEO_ID };
  }

  const settings = await db.siteSettings.findUnique({
    where: { id: "main" },
    select: { values: true },
  });
  if (!settings) return { enabled: true, videoId: DEFAULT_HERO_VIDEO_ID };

  const values = settings.values;
  if (values === null || typeof values !== "object" || Array.isArray(values)) {
    return { enabled: true, videoId: DEFAULT_HERO_VIDEO_ID };
  }

  const settingsValues = values as Prisma.JsonObject;
  const videoId = settingsValues.heroVideoId;
  const enabled = settingsValues.heroVideoEnabled !== false;
  if (typeof videoId !== "string" || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return { enabled, videoId: DEFAULT_HERO_VIDEO_ID };
  }
  return { enabled, videoId };
}
