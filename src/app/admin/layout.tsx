import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-foreground flex min-h-screen flex-col bg-background">
      <AdminNav />
      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
