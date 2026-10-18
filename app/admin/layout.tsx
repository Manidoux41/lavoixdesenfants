import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { BrandSymbol } from "@/components/brand-symbol";
import { getAdminUser } from "@/lib/admin-auth";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration" },
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdminUser();

  return (
    <div className="admin-shell">
      {user && (
        <header className="admin-header">
          <Link className="admin-brand" href="/admin">
            <BrandSymbol className="brand-mark" />
            <span>La Voix <small>Administration</small></span>
          </Link>
          <nav aria-label="Administration">
            <Link href="/admin">Tableau de bord</Link>
            <Link href="/admin/articles">Articles</Link>
            <Link href="/admin/categories">Catégories</Link>
          </nav>
          <form action={logoutAction}>
            <button type="submit" className="admin-logout"><LogOut size={15} aria-hidden="true" /> Déconnexion</button>
          </form>
        </header>
      )}
      {children}
    </div>
  );
}
