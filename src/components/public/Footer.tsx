import React from "react";
import Link from "next/link";
import { Flame, Trophy, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border bg-psg-950 text-psg-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Motto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-psg-500 to-psg-700 flex items-center justify-center border border-accent-cyan/30">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-wider">
                PSG <span className="text-accent-cyan text-base font-normal">FÚTBOL 7</span>
              </span>
            </div>
            <p className="text-sm text-psg-300/80 max-w-sm">
              Ave Fénix y Garra. Equipo de barrio compitiendo con orgullo, intensidad y compañerismo en cada jornada.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-accent-cyan">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Pasión
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Resurgimiento
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Compromiso
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent-cyan transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/plantilla" className="hover:text-accent-cyan transition-colors">
                  Plantilla Oficial
                </Link>
              </li>
              <li>
                <Link href="/partidos" className="hover:text-accent-cyan transition-colors">
                  Calendario & Resultados
                </Link>
              </li>
            </ul>
          </div>

          {/* CM & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Gestión</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="hover:text-accent-cyan transition-colors">
                  Acceso Backoffice CM
                </Link>
              </li>
              <li className="text-xs text-psg-400">
                Panel optimizado para móviles y actas digitales en tiempo real.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-psg-400 gap-4">
          <p>© {new Date().getFullYear()} PSG Fútbol 7. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-accent-crimson fill-accent-crimson" /> para el equipo
          </p>
        </div>
      </div>
    </footer>
  );
}

