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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-psg-500 to-psg-700 flex items-center justify-center border border-accent-cyan/40 shadow-glow group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white phoenix-glow" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-wider text-white group-hover:text-accent-cyan transition-colors">
              PSG <span className="text-accent-cyan text-sm font-normal">F7</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-psg-300 font-semibold">
              Oficial
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-surface-active text-accent-cyan border border-accent-cyan/30 shadow-sm"
                    : "text-psg-200 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Link (CM) & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-psg-300 bg-surface-muted hover:text-accent-cyan hover:border-accent-cyan/40 border border-surface-border transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panel CM</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-lg text-psg-200 hover:text-white hover:bg-white/10"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-psg-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-surface-active text-accent-cyan border border-accent-cyan/30"
                    : "text-psg-200 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

