import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SettingsForm } from "@/app/admin/settings/settings-form";
import { DEFAULT_HERO_VIDEO_ID, getHeroVideoSettings } from "@/lib/site-settings";
import { requireAdministrator } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Réglages du site" };

export default async function SiteSettingsPage() {
  await requireAdministrator();

  const videoSettings = await getHeroVideoSettings();
  const videoUrl = `https://www.youtube.com/watch?v=${videoSettings.videoId || DEFAULT_HERO_VIDEO_ID}`;

  return (
    <main className="admin-main admin-editor-page" id="contenu">
      <Link className="admin-back" href="/admin"><ArrowLeft size={15} aria-hidden="true" /> Tableau de bord</Link>
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">CONFIGURATION</p>
          <h1>Réglages du site</h1>
          <p>Choisissez la vidéo d’ambiance affichée dans le hero de l’accueil.</p>
        </div>
      </div>
      <SettingsForm videoEnabled={videoSettings.enabled} videoUrl={videoUrl} />
      <p className="admin-help">
        <a href={`https://www.youtube.com/watch?v=${DEFAULT_HERO_VIDEO_ID}`} rel="noreferrer" target="_blank">
          Vidéo proposée : « Pourquoi autant de placements abusifs ? » — La Maison des Maternelles, France Télévisions.
        </a>
      </p>
    </main>
  );
}
