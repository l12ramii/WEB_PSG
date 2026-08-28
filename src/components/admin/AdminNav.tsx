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
      // Handled
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-psg-950/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Brand & CM Badge */}
        <div className="flex items-center gap-3.5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-psg-600 font-bold text-psg-950 shadow-glow">
              <Flame className="h-6 w-6 text-psg-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-black tracking-wider text-white">
                  PSG
                </span>
                <span className="rounded border border-accent-cyan/30 bg-accent-cyan/15 px-2 py-0.5 font-display text-[11px] font-black tracking-widest text-accent-cyan">
                  BACKOFFICE
                </span>
              </div>
              <span className="flex items-center gap-1 font-display text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                Modo Community Manager
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 rounded-2xl border border-surface-border bg-surface-muted p-1.5 md:flex">
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
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all",
                  isActive
                    ? "border border-accent-cyan/30 bg-accent-electric text-white shadow-glow"
                    : "text-psg-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-xl border border-surface-border px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-psg-200 transition-colors hover:bg-surface-hover hover:text-white sm:flex"
          >
            <ExternalLink className="h-3.5 w-3.5 text-accent-cyan" />
            <span>Ver Web</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-surface-border bg-surface-muted p-2.5 text-psg-200 hover:text-white md:hidden"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-surface-border bg-psg-950/95 px-4 py-3 backdrop-blur-2xl md:hidden">
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
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-bold uppercase tracking-wider transition-colors",
                  isActive
                    ? "border border-accent-cyan/30 bg-accent-electric text-white shadow-glow"
                    : "text-psg-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-surface-border/60 pt-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-bold uppercase text-psg-300 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 text-accent-cyan" />
              <span>Abrir Web Pública</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
