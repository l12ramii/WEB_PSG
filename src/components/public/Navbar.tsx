"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, Calendar, Lock, Menu, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio", icon: Shield },
    { href: "/plantilla", label: "Plantilla", icon: Users },
    { href: "/partidos", label: "Partidos", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border/80 bg-psg-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-accent-cyan/40 bg-gradient-to-br from-psg-500 to-psg-700 shadow-glow transition-transform group-hover:scale-105">
            <Flame className="phoenix-glow h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-wider text-white transition-colors group-hover:text-accent-cyan">
              PSG{" "}
              <span className="text-sm font-normal text-accent-cyan">F7</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-psg-300">
              Oficial
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border border-accent-cyan/30 bg-surface-active text-accent-cyan shadow-sm"
                    : "text-psg-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Link (CM) & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-muted px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-psg-300 transition-all hover:border-accent-cyan/40 hover:text-accent-cyan"
          >
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Panel CM</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-psg-200 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Abrir menú"
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
        <div className="space-y-1 border-t border-surface-border bg-psg-900/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  isActive
                    ? "border border-accent-cyan/30 bg-surface-active text-accent-cyan"
                    : "text-psg-200 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
