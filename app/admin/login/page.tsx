import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function AdminLoginPage() {
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="admin-login" id="contenu">
      <Link className="admin-login-back" href="/">← Retour au site</Link>
      <p className="admin-kicker">ESPACE PRIVÉ</p>
      <h1>Connexion</h1>
      {databaseConfigured ? (
        <>
          <p className="admin-login-intro">Réservé aux personnes autorisées par l’association.</p>
          <LoginForm />
          <p className="admin-login-footnote">La création de compte n’est pas disponible depuis cette page.</p>
        </>
      ) : (
        <div className="admin-demo-notice">
          <p>La base de données n’est pas encore connectée. La connexion réelle à l’administration est temporairement indisponible.</p>
          <Link className="admin-primary" href="/admin/demo">Découvrir l’aperçu de l’administration</Link>
          <p className="admin-login-footnote">Cet aperçu utilise uniquement des données fictives et ne permet aucune modification.</p>
        </div>
      )}
    </main>
  );
}
