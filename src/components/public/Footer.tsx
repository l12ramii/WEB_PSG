import React from "react";
import Link from "next/link";
import { Flame, Trophy, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border bg-psg-950 text-psg-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Motto */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-cyan/30 bg-gradient-to-br from-psg-500 to-psg-700">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                PSG{" "}
                <span className="text-base font-normal text-accent-cyan">
                  FÚTBOL 7
                </span>
              </span>
            </div>
            <p className="max-w-sm text-sm text-psg-300/80">
              Ave Fénix y Garra. Equipo de barrio compitiendo con orgullo,
              intensidad y compañerismo en cada jornada.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-accent-cyan">
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" /> Pasión
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Resurgimiento
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" /> Compromiso
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-accent-cyan"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/plantilla"
                  className="transition-colors hover:text-accent-cyan"
                >
                  Plantilla Oficial
                </Link>
              </li>
              <li>
                <Link
                  href="/partidos"
                  className="transition-colors hover:text-accent-cyan"
                >
                  Calendario & Resultados
                </Link>
              </li>
            </ul>
          </div>

          {/* CM & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Gestión
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/admin"
                  className="transition-colors hover:text-accent-cyan"
                >
                  Acceso Backoffice CM
                </Link>
              </li>
              <li className="text-xs text-psg-400">
                Panel optimizado para móviles y actas digitales en tiempo real.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-border/60 pt-6 text-xs text-psg-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} PSG Fútbol 7. Todos los derechos
            reservados.
          </p>
          <p className="flex items-center gap-1">
            Hecho con{" "}
            <Heart className="h-3.5 w-3.5 fill-accent-crimson text-accent-crimson" />{" "}
            para el equipo
          </p>
        </div>
      </div>
    </footer>
  );
}
