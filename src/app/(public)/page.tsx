import React from "react";
import Link from "next/link";
import { Flame, Shield, Trophy, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { getNextMatch, getLastResult, getStatLeaders } from "@/lib/data";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { StatLeaders } from "@/components/public/StatLeaders";
import { MatchCard } from "@/components/public/MatchCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatMatchDate, getCompetitionLabel } from "@/lib/utils";

export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  const nextMatch = await getNextMatch();
  const lastResult = await getLastResult();
  const leaders = await getStatLeaders();

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-hero-pattern pt-16 pb-20 md:pt-24 md:pb-28 border-b border-surface-border/60">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-psg-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-accent-cyan/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
          {/* Emblem Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-active/80 border border-accent-cyan/40 text-accent-cyan text-xs font-bold uppercase tracking-widest shadow-glow">
            <Flame className="w-4 h-4 text-accent-cyan animate-pulse" />
            <span>Ave Fénix · Resurgimiento y Garra</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
            PSG <span className="text-accent-cyan text-glow">FÚTBOL 7</span>
          </h1>

          <p className="text-base sm:text-lg text-psg-200/90 max-w-2xl mx-auto leading-relaxed">
            Plataforma oficial del equipo. Sigue el calendario en directo, consulta las actas de cada jornada y descubre las estadísticas individuales de nuestros jugadores.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/plantilla">
              <Button size="lg" className="shadow-glow">
                Ver Plantilla Oficial <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/partidos">
              <Button variant="secondary" size="lg">
                Calendario & Resultados
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MATCH WIDGETS SECTION (Next Match Countdown + Recent Result) */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximo Partido Banner */}
          <div className="rounded-3xl bg-surface border border-accent-cyan/30 p-6 sm:p-8 relative overflow-hidden shadow-card flex flex-col justify-between">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-ping" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent-cyan">
                    Próximo Encuentro
                  </h3>
                </div>
                {nextMatch && (
                  <Badge variant={nextMatch.competition}>
                    {getCompetitionLabel(nextMatch.competition)}
                  </Badge>
                )}
              </div>

              {nextMatch ? (
                <div className="space-y-6">
                  {/* Teams Row */}
                  <div className="flex items-center justify-between gap-4 py-2">
                    {/* PSG */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-psg-600 flex items-center justify-center font-bold text-white shadow-glow">
                        PSG
                      </div>
                      <span className="font-display text-xl font-bold text-white">PSG F7</span>
                    </div>

                    <span className="font-mono text-sm font-bold text-psg-400">VS</span>

                    {/* Rival */}
                    <div className="flex items-center gap-3 text-right">
                      <span className="font-display text-xl font-bold text-white">
                        {nextMatch.rival?.name || "Rival"}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center overflow-hidden">
                        {nextMatch.rival?.shield_url ? (
                          <img
                            src={nextMatch.rival.shield_url}
                            alt={nextMatch.rival.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Shield className="w-6 h-6 text-psg-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Date & Condition */}
                  <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center text-xs text-psg-200">
                    <p className="font-semibold capitalize">
                      {formatMatchDate(nextMatch.match_date)}
                    </p>
                    <p className="text-psg-400 text-[11px] mt-0.5">
                      Condición: {nextMatch.is_home ? "Local (Campo PSG)" : "Visitante"}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="pt-2 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-psg-400 mb-3">
                      Cuenta atrás para el pitido inicial
                    </span>
                    <CountdownTimer targetDate={nextMatch.match_date} />
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-psg-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No hay próximos partidos programados actualmente.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border flex justify-end">
              <Link
                href="/partidos"
                className="text-xs font-bold uppercase tracking-wider text-accent-cyan hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                Ver calendario completo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Último Resultado */}
          <div className="rounded-3xl bg-surface border border-surface-border p-6 sm:p-8 relative overflow-hidden shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-psg-300">
                  Último Resultado Oficial
                </h3>
                {lastResult && (
                  <Badge variant={lastResult.competition}>
                    {getCompetitionLabel(lastResult.competition)}
                  </Badge>
                )}
              </div>

              {lastResult ? (
                <div className="space-y-6">
                  <MatchCard match={lastResult} />
                </div>
              ) : (
                <div className="py-12 text-center text-psg-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No hay resultados registrados todavía.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border flex justify-end">
              <Link
                href="/partidos"
                className="text-xs font-bold uppercase tracking-wider text-psg-300 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                Ver todos los resultados <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESTACADOS DE LA TEMPORADA (STAT LEADERS) */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-gold mb-1">
              <Trophy className="w-4 h-4 text-accent-gold" />
              <span>Rendimiento Individual</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Líderes de la Temporada
            </h2>
          </div>
          <Link href="/plantilla">
            <Button variant="outline" size="sm">
              Ver Plantilla Completa
            </Button>
          </Link>
        </div>

        <StatLeaders
          topScorer={leaders.topScorer}
          topAssistant={leaders.topAssistant}
          topKeeper={leaders.topKeeper}
        />
      </section>

      {/* 4. CLUB IDENTITY & VALUES */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-psg-900 to-psg-800 border border-surface-border p-8 sm:p-12 relative overflow-hidden text-center max-w-4xl mx-auto space-y-6">
          <Flame className="w-12 h-12 text-accent-cyan mx-auto phoenix-glow" />
          <h3 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            El Fénix Nunca se Rinde
          </h3>
          <p className="text-sm sm:text-base text-psg-200 max-w-xl mx-auto leading-relaxed">
            Fútbol 7 con identidad, intensidad en cada balón y la unión de un grupo de amigos defendiendo los colores azul marino y blanco.
          </p>
          <div className="pt-2">
            <Link href="/plantilla">
              <Button variant="gold" size="lg">
                Conoce a Nuestros Jugadores
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

