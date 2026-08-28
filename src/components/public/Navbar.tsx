"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Users,
  Calendar,
  Lock,
  Menu,
  X,
  Flame,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio", icon: Shield },
    { href: "/plantilla", label: "Plantilla", icon: Users },
    { href: "/partidos", label: "Calendario & Resultados", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/80 bg-psg-950/85 backdrop-blur-xl">
      {/* Top micro-bar */}
      <div className="hidden w-full border-b border-surface-border/40 bg-gradient-to-r from-psg-950 via-psg-900 to-psg-950 px-4 py-1 font-display text-[11px] uppercase tracking-widest text-psg-300 sm:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span>Temporada Regular 2026/27 · PSG Fútbol 7 Oficial</span>
          </div>
          <div className="flex items-center gap-4 font-bold text-accent-cyan">
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-accent-cyan" /> Resurgimiento y
              Garra
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-3.5">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-accent-cyan/40 bg-gradient-to-br from-psg-600 via-psg-700 to-psg-900 shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:border-accent-cyan">
            <Flame className="phoenix-glow h-7 w-7 text-accent-cyan transition-transform group-hover:rotate-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-black tracking-wider text-white transition-colors group-hover:text-accent-cyan">
                PSG
              </span>
              <span className="rounded border border-accent-cyan/30 bg-accent-cyan/15 px-1.5 py-0.5 font-display text-xs font-black tracking-widest text-accent-cyan">
                F7
              </span>
            </div>
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-psg-300">
              Club Oficial
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 rounded-2xl border border-surface-border bg-surface-muted/90 p-1.5 backdrop-blur-md md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  isActive
                    ? "border border-accent-cyan/30 bg-gradient-to-r from-psg-600 to-accent-electric text-white shadow-glow"
                    : "text-psg-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-accent-cyan" : "text-psg-400"
                  )}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA: Backoffice CM */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-surface-border bg-gradient-to-r from-surface-active to-surface-hover px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-accent-cyan/50 hover:from-psg-600 hover:to-accent-electric hover:shadow-glow"
          >
            <Lock className="h-3.5 w-3.5 text-accent-cyan" />
            <span className="hidden sm:inline">Panel CM</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-surface-border bg-surface-muted p-2.5 text-psg-200 hover:text-white md:hidden"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="animate-in slide-in-from-top-4 space-y-2 border-t border-surface-border bg-psg-950/95 px-4 pb-6 pt-3 backdrop-blur-2xl duration-200 md:hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-bold uppercase tracking-wider transition-colors",
                  isActive
                    ? "border border-accent-cyan/40 bg-accent-electric text-white shadow-glow"
                    : "text-psg-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-surface-border pt-3">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/15 py-3 font-display text-xs font-bold uppercase tracking-wider text-accent-cyan"
            >
              <Lock className="h-4 w-4" /> Acceso al Panel de Administración
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
