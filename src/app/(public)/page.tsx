import React from "react";
import Link from "next/link";
import {
  Flame,
  Shield,
  Trophy,
  ChevronRight,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Target,
  Award,
} from "lucide-react";
import {
  getNextMatch,
  getLastResult,
  getStatLeaders,
  getMatches,
  getPlayers,
} from "@/lib/data";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { StatLeaders } from "@/components/public/StatLeaders";
import { MatchCard } from "@/components/public/MatchCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatMatchDate, getCompetitionLabel } from "@/lib/utils";

export const revalidate = 0;

export default async function HomePage() {
  const nextMatch = await getNextMatch();
  const lastResult = await getLastResult();
  const leaders = await getStatLeaders();
  const allMatches = await getMatches();
  const allPlayers = await getPlayers();

  const finishedMatches = allMatches.filter((m) => m.is_finished);
  const totalGoals = finishedMatches.reduce(
    (acc, m) => acc + (m.psg_score || 0),
    0
  );

  return (
    <div className="space-y-16 pb-24">
      {/* 1. MONUMENTAL HERO SECTION */}
      <section className="relative overflow-hidden border-b border-surface-border/60 bg-stadium-spotlight pb-20 pt-14 md:pb-32 md:pt-24">
        {/* Background stadium lighting aura */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-accent-cyan/15 blur-[120px]" />
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[300px] w-[400px] rounded-full bg-psg-500/20 blur-[100px]" />

        {/* Soccer Net Background Pattern */}
        <div className="bg-soccer-mesh pointer-events-none absolute inset-0 opacity-40" />

        <div className="container relative z-10 mx-auto max-w-5xl space-y-6 px-4 text-center">
          {/* Emblem Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/40 bg-surface-active/90 px-4 py-1.5 font-display text-xs font-black uppercase tracking-[0.2em] text-accent-cyan shadow-glow backdrop-blur-md">
            <Flame className="phoenix-glow h-4 w-4 animate-pulse text-accent-cyan" />
            <span>Fuerza · Resurgimiento · Garra</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl md:text-9xl">
            PSG <span className="text-glow text-accent-cyan">FÚTBOL 7</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-psg-200/90 sm:text-xl">
            El corazón de un equipo de barrio forjado en el compañerismo. Sigue
            todos los partidos, clasificaciones y el rendimiento individual de
            cada jugador.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/plantilla">
              <Button size="lg" className="text-base shadow-glow">
                Ver Plantilla Oficial <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/partidos">
              <Button variant="secondary" size="lg" className="text-base">
                <Calendar className="h-5 w-5 text-accent-cyan" /> Calendario &
                Actas
              </Button>
            </Link>
          </div>

          {/* Quick Stats Ticker Bar */}
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 pt-10 sm:grid-cols-4">
            <div className="rounded-2xl border border-surface-border bg-surface-muted/80 p-3.5 backdrop-blur-md">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
                Plantilla
              </span>
              <span className="font-display text-2xl font-black text-white">
                {allPlayers.length} Jugadores
              </span>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface-muted/80 p-3.5 backdrop-blur-md">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
                Partidos Jugados
              </span>
              <span className="text-glow font-display text-2xl font-black text-accent-cyan">
                {finishedMatches.length} Jornadas
              </span>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface-muted/80 p-3.5 backdrop-blur-md">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
                Goles a Favor
              </span>
              <span className="font-display text-2xl font-black text-emerald-400">
                {totalGoals} Goles
              </span>
            </div>

            <div className="rounded-2xl border border-surface-border bg-surface-muted/80 p-3.5 backdrop-blur-md">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
                Eficacia
              </span>
              <span className="font-display text-2xl font-black text-amber-400">
                100% Pasión
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MATCHDAY HUD SECTION (Next Match + Recent Result) */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Próximo Partido Card */}
          <div className="relative flex select-none flex-col justify-between overflow-hidden rounded-3xl border border-accent-cyan/40 bg-card-gradient p-6 shadow-card sm:p-8">
            {/* Top ambient illumination */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />

            <div>
              <div className="mb-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-accent-cyan" />
                  <h3 className="font-display text-sm font-black uppercase tracking-widest text-accent-cyan">
                    Próxima Cita Oficial
                  </h3>
                </div>
                {nextMatch && (
                  <Badge variant={nextMatch.competition} dot>
                    {getCompetitionLabel(nextMatch.competition)}
                  </Badge>
                )}
              </div>

              {nextMatch ? (
                <div className="space-y-6">
                  {/* Teams Row */}
                  <div className="flex items-center justify-between gap-4 py-2">
                    {/* PSG Side */}
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-accent-cyan bg-gradient-to-br from-psg-600 to-psg-900 shadow-glow">
                        <Flame className="phoenix-glow h-8 w-8 text-white" />
                      </div>
                      <div>
                        <span className="block font-display text-2xl font-black text-white">
                          PSG F7
                        </span>
                        <span className="font-display text-[11px] font-bold uppercase tracking-wider text-accent-cyan">
                          {nextMatch.is_home ? "Local" : "Visitante"}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-lg border border-surface-border bg-surface-muted px-2.5 py-1 font-display text-lg font-black text-psg-400">
                      VS
                    </span>

                    {/* Rival Side */}
                    <div className="flex items-center gap-3.5 text-right">
                      <div>
                        <span className="block max-w-[140px] truncate font-display text-2xl font-black text-white sm:max-w-none">
                          {nextMatch.rival?.name || "Rival"}
                        </span>
                        <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
                          {!nextMatch.is_home ? "Local" : "Visitante"}
                        </span>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-surface-border bg-surface-muted p-2">
                        {nextMatch.rival?.shield_url ? (
                          <img
                            src={nextMatch.rival.shield_url}
                            alt={nextMatch.rival.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Shield className="h-7 w-7 text-psg-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Date and Field */}
                  <div className="rounded-2xl border border-surface-border bg-surface-muted/90 p-3.5 text-center text-xs text-psg-200">
                    <p className="font-display text-sm font-bold capitalize text-white">
                      {formatMatchDate(nextMatch.match_date)}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-psg-400">
                      Sede:{" "}
                      {nextMatch.is_home
                        ? "Campo Principal PSG F7"
                        : "Instalaciones del Rival"}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex flex-col items-center pt-2">
                    <span className="mb-3 flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-widest text-psg-300">
                      <Clock className="h-3.5 w-3.5 text-accent-cyan" /> Cuenta
                      atrás para el pitido inicial
                    </span>
                    <CountdownTimer targetDate={nextMatch.match_date} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-12 text-center text-psg-400">
                  <Calendar className="mx-auto h-12 w-12 opacity-40" />
                  <p className="text-sm">
                    No hay próximos partidos programados actualmente.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-surface-border pt-4">
              <Link
                href="/partidos"
                className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-accent-cyan transition-colors hover:text-white"
              >
                Ver calendario completo de la temporada{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Último Resultado Oficial */}
          <div className="relative flex select-none flex-col justify-between overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 shadow-card sm:p-8">
            {/* Top ambient illumination */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div>
              <div className="mb-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-display text-sm font-black uppercase tracking-widest text-white">
                    Último Resultado Oficial
                  </h3>
                </div>
                {lastResult && (
                  <Badge variant={lastResult.competition} dot>
                    {getCompetitionLabel(lastResult.competition)}
                  </Badge>
                )}
              </div>

              {lastResult ? (
                <div className="space-y-4">
                  <MatchCard match={lastResult} />
                </div>
              ) : (
                <div className="space-y-3 py-12 text-center text-psg-400">
                  <Trophy className="mx-auto h-12 w-12 opacity-40" />
                  <p className="text-sm">
                    Aún no hay resultados de partidos registrados.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-surface-border pt-4">
              <Link
                href="/partidos"
                className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
              >
                Historial completo de actas y marcadores{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TROPHY AWARDS & STAT LEADERS */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 font-display text-xs font-black uppercase tracking-widest text-accent-gold">
              <Trophy className="h-4 w-4 text-accent-gold" />
              <span>Rendimiento Individual</span>
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Cuadro de{" "}
              <span className="text-glow-gold text-accent-gold">Honor</span>
            </h2>
          </div>
          <Link href="/plantilla">
            <Button variant="outline" size="sm">
              Ver Todos los Jugadores
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
        <div className="relative mx-auto max-w-4xl space-y-6 overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-r from-psg-900 via-surface to-psg-950 p-8 text-center shadow-2xl sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent-cyan bg-gradient-to-br from-psg-600 to-accent-electric shadow-glow">
            <Flame className="phoenix-glow h-10 w-10 text-white" />
          </div>

          <h3 className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl">
            El Fénix Nunca se Rinde
          </h3>
          <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-psg-200 sm:text-base">
            Fútbol 7 con identidad de barrio, entrega en cada balón dividido y
            el orgullo de competir juntos bajo los mismos colores.
          </p>

          <div className="pt-2">
            <Link href="/plantilla">
              <Button variant="gold" size="lg" className="text-base">
                <Sparkles className="h-4 w-4" /> Conoce la Plantilla 2026/27
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
