import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminNav />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

