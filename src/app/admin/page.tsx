import React from "react";
import Link from "next/link";
import {
  CalendarPlus,
  FileSpreadsheet,
  UserPlus,
  ShieldAlert,
  Users,
  CalendarCheck,
  Trophy,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
} from "lucide-react";
import { getMatches, getPlayers, getRivals } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatShortDate, getCompetitionLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const matches = await getMatches();
  const players = await getPlayers();
  const rivals = await getRivals();

  const finishedMatches = matches.filter((m) => m.is_finished);
  const pendingMatches = matches.filter((m) => !m.is_finished);

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Banner */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-r from-psg-900 via-surface to-psg-950 p-6 shadow-2xl sm:p-10 md:flex-row md:items-center">
        {/* Top ambient illumination */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/15 px-3.5 py-1 font-display text-xs font-black uppercase tracking-widest text-accent-cyan">
            <Sparkles className="h-3.5 w-3.5" /> Backoffice Oficial PSG F7
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Panel de Control del{" "}
            <span className="text-glow text-accent-cyan">CM</span>
          </h1>
          <p className="max-w-xl text-xs font-medium text-psg-300 sm:text-sm">
            Registra los resultados de las jornadas, gestiona los rivales y
            mantén las estadísticas de la plantilla al día en segundos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/partidos/nuevo">
            <Button size="lg" className="shadow-glow">
              <CalendarPlus className="h-4 w-4" /> Programar Partido
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-surface-border bg-card-gradient p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
              Plantilla PSG
            </span>
            <Users className="h-5 w-5 text-accent-cyan" />
          </div>
          <p className="mt-2 font-display text-4xl font-black text-white">
            {players.length}
          </p>
          <span className="mt-1 block font-display text-xs font-bold uppercase text-emerald-400">
            {players.filter((p) => p.is_active).length} Jugadores Activos
          </span>
        </div>

        <div className="rounded-3xl border border-surface-border bg-card-gradient p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
              Rivales Registrados
            </span>
            <Trophy className="h-5 w-5 text-accent-gold" />
          </div>
          <p className="mt-2 font-display text-4xl font-black text-accent-gold">
            {rivals.length}
          </p>
          <span className="mt-1 block font-display text-xs font-bold uppercase text-psg-400">
            Equipos en Directorio
          </span>
        </div>

        <div className="rounded-3xl border border-surface-border bg-card-gradient p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
              Actas Cerradas
            </span>
            <CalendarCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-2 font-display text-4xl font-black text-emerald-400">
            {finishedMatches.length}
          </p>
          <span className="mt-1 block font-display text-xs font-bold uppercase text-accent-cyan">
            Partidos Disputados
          </span>
        </div>

        <div className="rounded-3xl border border-surface-border bg-card-gradient p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
              Por Disputarse
            </span>
            <Clock className="h-5 w-5 text-rose-400" />
          </div>
          <p className="mt-2 font-display text-4xl font-black text-rose-400">
            {pendingMatches.length}
          </p>
          <span className="mt-1 block font-display text-xs font-bold uppercase text-psg-400">
            Próximos Encuentros
          </span>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/partidos/nuevo" className="group">
          <div className="h-full space-y-3 rounded-3xl border border-surface-border bg-surface p-6 shadow-card transition-all duration-300 hover:border-accent-cyan/50 hover:bg-surface-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-electric/20 text-accent-cyan transition-transform group-hover:scale-110">
              <CalendarPlus className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Programar Partido
            </h3>
            <p className="text-xs font-medium leading-relaxed text-psg-300">
              Fija fecha, hora, rival y competición para el próximo encuentro.
            </p>
          </div>
        </Link>

        <Link href="/admin/partidos" className="group">
          <div className="h-full space-y-3 rounded-3xl border border-surface-border bg-surface p-6 shadow-card transition-all duration-300 hover:border-amber-400/50 hover:bg-surface-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 transition-transform group-hover:scale-110">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Actas de Partido
            </h3>
            <p className="text-xs font-medium leading-relaxed text-psg-300">
              Introduce el marcador, goleadores y asistentes de los partidos.
            </p>
          </div>
        </Link>

        <Link href="/admin/jugadores" className="group">
          <div className="h-full space-y-3 rounded-3xl border border-surface-border bg-surface p-6 shadow-card transition-all duration-300 hover:border-emerald-400/50 hover:bg-surface-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 transition-transform group-hover:scale-110">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Gestionar Plantilla
            </h3>
            <p className="text-xs font-medium leading-relaxed text-psg-300">
              Añade fichajes, actualiza dorsales y edita fotos de jugadores.
            </p>
          </div>
        </Link>

        <Link href="/admin/rivales" className="group">
          <div className="h-full space-y-3 rounded-3xl border border-surface-border bg-surface p-6 shadow-card transition-all duration-300 hover:border-purple-400/50 hover:bg-surface-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 transition-transform group-hover:scale-110">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Directorio Rivales
            </h3>
            <p className="text-xs font-medium leading-relaxed text-psg-300">
              Guarda los escudos y nombres de los rivales para reutilizarlos.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Matches & Quick Sheets */}
      <div className="space-y-6 rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl font-black uppercase tracking-wide text-white">
              Actas Recientes de la Temporada
            </h3>
            <p className="text-xs font-medium text-psg-300">
              Haz clic en cualquier partido para rellenar o modificar su acta
              oficial.
            </p>
          </div>
          <Link href="/admin/partidos">
            <Button variant="outline" size="sm">
              Ver Todos los Partidos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-surface-border">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="py-4.5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <Badge variant={match.competition} dot>
                  {getCompetitionLabel(match.competition)}
                </Badge>
                <div>
                  <h4 className="font-display text-lg font-bold text-white">
                    PSG F7 vs {match.rival?.name || "Rival"}
                  </h4>
                  <p className="text-xs font-medium text-psg-400">
                    {formatShortDate(match.match_date)} ·{" "}
                    {match.is_home ? "Local" : "Visitante"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {match.is_finished ? (
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-surface-border bg-surface-muted px-3 py-1 font-display text-xl font-black text-accent-cyan">
                      {match.psg_score} - {match.rival_score}
                    </span>
                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button variant="secondary" size="sm">
                        Editar Acta
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link href={`/admin/partidos/${match.id}/acta`}>
                    <Button size="sm">
                      <FileSpreadsheet className="h-3.5 w-3.5" /> Rellenar Acta
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
