import { del, put } from "@vercel/blob";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/admin-auth";
import { isValidImageUpload, MAX_MEDIA_UPLOAD_BYTES } from "@/lib/media-validation";

function safeFilename(filename: string) {
  const basename = filename.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[\\/]/)
    .pop() ?? "image";
  const safe = basename.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return safe.slice(0, 100) || "image";
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || new URL(request.url).protocol.slice(0, -1);
  if (
    !origin
    || !host
    || !URL.canParse(origin)
    || (protocol !== "http" && protocol !== "https")
    || !URL.canParse(`${protocol}://${host}`)
    || new URL(origin).origin !== new URL(`${protocol}://${host}`).origin
  ) {
    return jsonError("Origine de la requête non autorisée.", 403);
  }

  const user = await getAdminUser();
  if (!user) return jsonError("Connexion à l’administration requise.", 401);
  if (
    !process.env.BLOB_READ_WRITE_TOKEN
    && !(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  ) {
    return jsonError("Le stockage d’images Vercel Blob n’est pas configuré.", 503);
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError("Choisissez une image à envoyer.", 400);
  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    return jsonError("L’image ne doit pas dépasser 4 Mo.", 413);
  }

  const altTextValue = formData.get("altText");
  const altText = typeof altTextValue === "string" ? altTextValue.trim() : "";
  if (altText.length > 250) return jsonError("Le texte alternatif ne doit pas dépasser 250 caractères.", 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isValidImageUpload(file.type, file.size, bytes)) {
    return jsonError("Format non pris en charge. Utilisez une image JPEG, PNG ou WebP valide, de 4 Mo maximum.", 400);
  }

  const blob = await put(
    `association-media/${safeFilename(file.name)}`,
    file,
    {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    },
  );

  try {
    const media = await db.media.create({
      data: {
        url: blob.url,
        storageKey: blob.pathname,
        filename: safeFilename(file.name),
        mimeType: file.type,
        size: file.size,
        altText: altText || null,
        uploadedById: user.id,
      },
      select: { url: true, filename: true, mimeType: true, size: true },
    });

    return Response.json(media, { status: 201 });
  } catch (error) {
    try {
      await del(blob.url);
    } catch (cleanupError) {
      console.error("Unable to remove Vercel Blob after a failed media record write.", cleanupError);
    }
    throw error;
  }
}
