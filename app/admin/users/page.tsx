import type { Metadata } from "next";
import { requireAdministrator } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { UserManager } from "@/app/admin/users/user-manager";

export const metadata: Metadata = { title: "Utilisateurs" };

const messages: Record<string, { type: "error" | "success"; text: string }> = {
  "create-invalid": { type: "error", text: "Vérifiez le nom, l’adresse e-mail, le rôle et le mot de passe (14 caractères minimum)." },
  "update-invalid": { type: "error", text: "Les informations du compte ne sont pas valides." },
  "email-exists": { type: "error", text: "Cette adresse e-mail est déjà utilisée." },
  "user-not-found": { type: "error", text: "Ce compte n’existe plus." },
  "self-role": { type: "error", text: "Vous ne pouvez pas modifier votre propre rôle." },
  "self-delete": { type: "error", text: "Vous ne pouvez pas supprimer votre propre compte." },
  "last-admin": { type: "error", text: "Il doit rester au moins un administrateur actif." },
  "concurrent-change": { type: "error", text: "Un autre changement de compte a eu lieu en même temps. Actualisez la page et réessayez." },
  "user-created": { type: "success", text: "Compte créé." },
  "user-updated": { type: "success", text: "Compte modifié." },
  "user-deleted": { type: "success", text: "Compte supprimé. Ses contenus ont été conservés." },
  "password-invalid": { type: "error", text: "Les deux nouveaux mots de passe doivent être identiques et contenir au moins 14 caractères." },
  "current-password-invalid": { type: "error", text: "Le mot de passe actuel est incorrect." },
  "self-password-reset": { type: "error", text: "Pour votre propre compte, utilisez le formulaire de changement de mot de passe avec vérification du mot de passe actuel." },
  "password-changed": { type: "success", text: "Votre mot de passe a été modifié. Votre session actuelle reste active." },
  "password-reset": { type: "success", text: "Mot de passe modifié ; les sessions de cet utilisateur ont été révoquées." },
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const admin = await requireAdministrator();
  const [users, params] = await Promise.all([
    db.user.findMany({
      orderBy: [{ createdAt: "asc" }],
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    searchParams,
  ]);
  const code = typeof params.error === "string" ? params.error : typeof params.success === "string" ? params.success : "";
  const message = messages[code];

  return (
    <main className="admin-main" id="contenu">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">ADMINISTRATION / ACCÈS</p>
          <h1>Utilisateurs</h1>
          <p>Créez les comptes et attribuez des droits adaptés à chacun.</p>
        </div>
      </div>
      {message && <p className={message.type === "error" ? "admin-error" : "admin-success"} role={message.type === "error" ? "alert" : "status"}>{message.text}</p>}
      <UserManager users={users} currentUserId={admin.id} />
    </main>
  );
}
