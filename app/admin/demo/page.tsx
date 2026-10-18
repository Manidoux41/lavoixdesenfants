import type { Metadata } from "next";
import { AdminDemo } from "@/app/admin/demo/admin-demo";

export const metadata: Metadata = {
  title: "Aperçu de l’administration",
  robots: { index: false, follow: false },
};

export default function AdminDemoPage() {
  return <AdminDemo />;
}
