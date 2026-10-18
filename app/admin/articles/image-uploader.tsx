"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { MAX_MEDIA_UPLOAD_BYTES } from "@/lib/media-validation";

type UploadResponse = {
  url?: unknown;
  error?: unknown;
};

export function AdminImageUploader({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  async function uploadImage() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setHasError(true);
      setMessage("Choisissez une image avant de l’envoyer.");
      return;
    }
    if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
      setHasError(true);
      setMessage("L’image ne doit pas dépasser 4 Mo.");
      return;
    }

    setUploading(true);
    setMessage("");
    setHasError(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result: UploadResponse = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        setHasError(true);
        setMessage(typeof result.error === "string" ? result.error : "L’envoi de l’image a échoué.");
        return;
      }

      onUploaded(result.url);
      if (inputRef.current) inputRef.current.value = "";
      setMessage("Image envoyée et enregistrée dans la médiathèque.");
    } catch {
      setHasError(true);
      setMessage("Impossible de joindre le service d’envoi. Vérifiez votre connexion et réessayez.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-field admin-image-upload">
      <label htmlFor="article-image-upload">Ajouter une image à la médiathèque</label>
      <div className="admin-upload-row">
        <input
          id="article-image-upload"
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby="article-image-upload-help"
        />
        <button className="admin-secondary" type="button" onClick={uploadImage} disabled={uploading}>
          <Upload size={15} aria-hidden="true" />
          {uploading ? "Envoi…" : "Envoyer"}
        </button>
      </div>
      <small id="article-image-upload-help">JPEG, PNG ou WebP · 4 Mo maximum. Le fichier est stocké dans Vercel Blob.</small>
      {message && <p className={hasError ? "admin-error" : "admin-success"} role={hasError ? "alert" : "status"}>{message}</p>}
    </div>
  );
}
