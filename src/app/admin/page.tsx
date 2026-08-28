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
} from "lucide-react";
import { getMatches, getPlayers, getRivals } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-surface-border bg-gradient-to-r from-psg-900 via-surface to-psg-950 p-6 shadow-card sm:p-8 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-cyan">
            <Sparkles className="h-3.5 w-3.5" /> Panel de Control del CM
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Gestión Rápida <span className="text-accent-cyan">PSG F7</span>
          </h1>
          <p className="max-w-xl text-xs text-psg-300 sm:text-sm">
            Gestiona resultados, convocatorias y estadísticas en tiempo real sin
            necesidad de conocimientos técnicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/partidos/nuevo">
            <Button size="md">
              <CalendarPlus className="h-4 w-4" /> Programar Partido
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">
              Jugadores
            </span>
            <Users className="h-5 w-5 text-accent-cyan" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-white">
            {players.length}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-emerald-400">
            {players.filter((p) => p.is_active).length} activos en plantilla
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">
              Rivales Registrados
            </span>
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-white">
            {rivals.length}
          </p>
          <span className="mt-1 block text-[11px] text-psg-400">
            Equipos en directorio
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">
              Partidos Jugados
            </span>
            <CalendarCheck className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-white">
            {finishedMatches.length}
          </p>
          <span className="mt-1 block text-[11px] text-accent-cyan">
            Actas completadas
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">
              Próximos Partidos
            </span>
            <CalendarPlus className="h-5 w-5 text-rose-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-white">
            {pendingMatches.length}
          </p>
          <span className="mt-1 block text-[11px] text-psg-400">
            Por disputarse
          </span>
        </Card>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/partidos/nuevo" className="group">
          <div className="h-full space-y-3 rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:border-accent-cyan/40 hover:bg-surface-hover">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-electric/20 text-accent-cyan transition-transform group-hover:scale-110">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Programar Partido
            </h3>
            <p className="text-xs text-psg-300">
              Fija fecha, hora, rival y competición para el próximo encuentro.
            </p>
          </div>
        </Link>

        <Link href="/admin/partidos" className="group">
          <div className="h-full space-y-3 rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:border-accent-cyan/40 hover:bg-surface-hover">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 transition-transform group-hover:scale-110">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Actas de Partido</h3>
            <p className="text-xs text-psg-300">
              Introduce el marcador, goleadores y asistentes de los partidos.
            </p>
          </div>
        </Link>

        <Link href="/admin/jugadores" className="group">
          <div className="h-full space-y-3 rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:border-accent-cyan/40 hover:bg-surface-hover">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 transition-transform group-hover:scale-110">
              <UserPlus className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Gestionar Plantilla
            </h3>
            <p className="text-xs text-psg-300">
              Añade fichajes, actualiza dorsales y edita fotos de jugadores.
            </p>
          </div>
        </Link>

        <Link href="/admin/rivales" className="group">
          <div className="h-full space-y-3 rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:border-accent-cyan/40 hover:bg-surface-hover">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 transition-transform group-hover:scale-110">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Directorio de Rivales
            </h3>
            <p className="text-xs text-psg-300">
              Guarda los escudos y nombres de los rivales para reutilizarlos.
            </p>
          </div>
        </Link>
      </div>

      {/* Partidos Recientes / Pendientes */}
      <div className="space-y-6 rounded-3xl border border-surface-border bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Partidos y Actas Recientes
            </h3>
            <p className="text-xs text-psg-300">
              Haz clic en cualquier partido para rellenar o modificar su acta
              oficial.
            </p>
          </div>
          <Link href="/admin/partidos">
            <Button variant="outline" size="sm">
              Ver Todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-surface-border">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <Badge variant={match.competition}>
                  {getCompetitionLabel(match.competition)}
                </Badge>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    PSG F7 vs {match.rival?.name || "Rival"}
                  </h4>
                  <p className="text-xs text-psg-400">
                    {formatShortDate(match.match_date)} ·{" "}
                    {match.is_home ? "Local" : "Visitante"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {match.is_finished ? (
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-surface-border bg-surface-muted px-2.5 py-1 font-mono text-base font-bold text-accent-cyan">
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
