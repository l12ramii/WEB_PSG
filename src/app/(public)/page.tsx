import React from "react";
import Link from "next/link";
import {
  Flame,
  Shield,
  Trophy,
  ChevronRight,
  Calendar,
  ArrowRight,
} from "lucide-react";
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
      <section className="relative overflow-hidden border-b border-surface-border/60 bg-hero-pattern pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Glow ambient background circles */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-psg-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-accent-cyan/10 blur-2xl" />

        <div className="container relative z-10 mx-auto max-w-4xl space-y-6 px-4 text-center">
          {/* Emblem Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/40 bg-surface-active/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-cyan shadow-glow">
            <Flame className="h-4 w-4 animate-pulse text-accent-cyan" />
            <span>Ave Fénix · Resurgimiento y Garra</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl md:text-8xl">
            PSG <span className="text-glow text-accent-cyan">FÚTBOL 7</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-psg-200/90 sm:text-lg">
            Plataforma oficial del equipo. Sigue el calendario en directo,
            consulta las actas de cada jornada y descubre las estadísticas
            individuales de nuestros jugadores.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/plantilla">
              <Button size="lg" className="shadow-glow">
                Ver Plantilla Oficial <ChevronRight className="h-4 w-4" />
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Próximo Partido Banner */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-accent-cyan/30 bg-surface p-6 shadow-card sm:p-8">
            {/* Background Glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-accent-cyan/5 blur-2xl" />

            <div>
              <div className="mb-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-accent-cyan" />
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
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-psg-600 font-bold text-white shadow-glow">
                        PSG
                      </div>
                      <span className="font-display text-xl font-bold text-white">
                        PSG F7
                      </span>
                    </div>

                    <span className="font-mono text-sm font-bold text-psg-400">
                      VS
                    </span>

                    {/* Rival */}
                    <div className="flex items-center gap-3 text-right">
                      <span className="font-display text-xl font-bold text-white">
                        {nextMatch.rival?.name || "Rival"}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-surface-border bg-surface-muted">
                        {nextMatch.rival?.shield_url ? (
                          <img
                            src={nextMatch.rival.shield_url}
                            alt={nextMatch.rival.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Shield className="h-6 w-6 text-psg-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Date & Condition */}
                  <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center text-xs text-psg-200">
                    <p className="font-semibold capitalize">
                      {formatMatchDate(nextMatch.match_date)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-psg-400">
                      Condición:{" "}
                      {nextMatch.is_home ? "Local (Campo PSG)" : "Visitante"}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex flex-col items-center pt-2">
                    <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-psg-400">
                      Cuenta atrás para el pitido inicial
                    </span>
                    <CountdownTimer targetDate={nextMatch.match_date} />
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-psg-400">
                  <Calendar className="mx-auto mb-3 h-12 w-12 opacity-40" />
                  <p className="text-sm">
                    No hay próximos partidos programados actualmente.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-surface-border pt-4">
              <Link
                href="/partidos"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent-cyan transition-colors hover:text-white"
              >
                Ver calendario completo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Último Resultado */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
            <div>
              <div className="mb-6 flex items-center justify-between gap-2">
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
                  <Trophy className="mx-auto mb-3 h-12 w-12 opacity-40" />
                  <p className="text-sm">
                    No hay resultados registrados todavía.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-surface-border pt-4">
              <Link
                href="/partidos"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
              >
                Ver todos los resultados <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DESTACADOS DE LA TEMPORADA (STAT LEADERS) */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-gold">
              <Trophy className="h-4 w-4 text-accent-gold" />
              <span>Rendimiento Individual</span>
            </div>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
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
        <div className="relative mx-auto max-w-4xl space-y-6 overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-r from-psg-900 to-psg-800 p-8 text-center sm:p-12">
          <Flame className="phoenix-glow mx-auto h-12 w-12 text-accent-cyan" />
          <h3 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            El Fénix Nunca se Rinde
          </h3>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-psg-200 sm:text-base">
            Fútbol 7 con identidad, intensidad en cada balón y la unión de un
            grupo de amigos defendiendo los colores azul marino y blanco.
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
