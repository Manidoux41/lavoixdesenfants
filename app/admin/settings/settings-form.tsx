"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveHeroVideoAction, type SiteSettingsFormState } from "@/app/admin/settings/actions";

const initialState: SiteSettingsFormState = {};

export function SettingsForm({ videoUrl, videoEnabled }: { videoUrl: string; videoEnabled: boolean }) {
  const [state, action, pending] = useActionState(saveHeroVideoAction, initialState);

  return (
    <form action={action} className="admin-editor">
      <div className="admin-field">
        <label htmlFor="hero-video-url">Lien YouTube de la vidéo d’arrière-plan</label>
        <input
          autoComplete="url"
          defaultValue={videoUrl}
          id="hero-video-url"
          maxLength={500}
          name="videoUrl"
          placeholder="https://www.youtube.com/watch?v=…"
          type="text"
        />
        <small>
          Collez l’adresse de la vidéo YouTube. Elle sera muette, en boucle et recouverte d’un voile bleu.
        </small>
      </div>
      <label className="admin-video-enabled" htmlFor="hero-video-enabled">
        <input
          defaultChecked={videoEnabled}
          id="hero-video-enabled"
          name="videoEnabled"
          type="checkbox"
        />
        Afficher la vidéo automatiquement sur la page d’accueil
      </label>
      <div className="admin-help admin-video-disclaimer">
        La vidéo démarre automatiquement pour les visiteurs. Vérifiez qu’elle est adaptée au contexte de l’association et que son intégration est autorisée par sa chaîne.
      </div>
      {state.error && <p className="admin-error" role="alert">{state.error}</p>}
      {state.success && <p className="admin-success" role="status">{state.success}</p>}
      <div className="admin-form-actions">
        <button className="admin-primary" disabled={pending} type="submit">
          <Save size={16} aria-hidden="true" /> {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
