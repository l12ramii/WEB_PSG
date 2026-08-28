"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Shield,
  LogOut,
  Flame,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/partidos", label: "Partidos & Actas", icon: CalendarCheck },
    { href: "/admin/jugadores", label: "Plantilla", icon: Users },
    { href: "/admin/rivales", label: "Rivales", icon: Shield },
  ];

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-psg-950/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand & CM Badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-psg-600 font-bold text-psg-950 shadow-glow">
              <Flame className="h-5 w-5 text-psg-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-wider text-white">
                PSG <span className="text-xs text-accent-cyan">BACKOFFICE</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                Modo CM
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all",
                  isActive
                    ? "border border-accent-cyan/30 bg-surface-active text-accent-cyan"
                    : "text-psg-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-semibold text-psg-300 transition-colors hover:bg-white/5 hover:text-white sm:flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Ver Web</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-psg-200 hover:bg-white/10 hover:text-white md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-surface-border bg-psg-900/95 px-4 py-3 backdrop-blur-xl md:hidden">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border border-accent-cyan/30 bg-surface-active text-accent-cyan"
                    : "text-psg-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-surface-border/60 pt-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-psg-300 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Abrir Web Pública</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
