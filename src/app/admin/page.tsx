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
      <div className="rounded-3xl bg-gradient-to-r from-psg-900 via-surface to-psg-950 border border-surface-border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Panel de Control del CM
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Gestión Rápida <span className="text-accent-cyan">PSG F7</span>
          </h1>
          <p className="text-xs sm:text-sm text-psg-300 max-w-xl">
            Gestiona resultados, convocatorias y estadísticas en tiempo real sin necesidad de conocimientos técnicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/partidos/nuevo">
            <Button size="md">
              <CalendarPlus className="w-4 h-4" /> Programar Partido
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">Jugadores</span>
            <Users className="w-5 h-5 text-accent-cyan" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-3">{players.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            {players.filter((p) => p.is_active).length} activos en plantilla
          </span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">Rivales Registrados</span>
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-3">{rivals.length}</p>
          <span className="text-[11px] text-psg-400 mt-1 block">Equipos en directorio</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">Partidos Jugados</span>
            <CalendarCheck className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-3">{finishedMatches.length}</p>
          <span className="text-[11px] text-accent-cyan mt-1 block">Actas completadas</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-psg-400">Próximos Partidos</span>
            <CalendarPlus className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-mono font-bold text-white mt-3">{pendingMatches.length}</p>
          <span className="text-[11px] text-psg-400 mt-1 block">Por disputarse</span>
        </Card>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/partidos/nuevo" className="group">
          <div className="h-full p-5 rounded-2xl bg-surface border border-surface-border hover:border-accent-cyan/40 hover:bg-surface-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-electric/20 text-accent-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Programar Partido</h3>
            <p className="text-xs text-psg-300">
              Fija fecha, hora, rival y competición para el próximo encuentro.
            </p>
          </div>
        </Link>

        <Link href="/admin/partidos" className="group">
          <div className="h-full p-5 rounded-2xl bg-surface border border-surface-border hover:border-accent-cyan/40 hover:bg-surface-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Actas de Partido</h3>
            <p className="text-xs text-psg-300">
              Introduce el marcador, goleadores y asistentes de los partidos.
            </p>
          </div>
        </Link>

        <Link href="/admin/jugadores" className="group">
          <div className="h-full p-5 rounded-2xl bg-surface border border-surface-border hover:border-accent-cyan/40 hover:bg-surface-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Gestionar Plantilla</h3>
            <p className="text-xs text-psg-300">
              Añade fichajes, actualiza dorsales y edita fotos de jugadores.
            </p>
          </div>
        </Link>

        <Link href="/admin/rivales" className="group">
          <div className="h-full p-5 rounded-2xl bg-surface border border-surface-border hover:border-accent-cyan/40 hover:bg-surface-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Directorio de Rivales</h3>
            <p className="text-xs text-psg-300">
              Guarda los escudos y nombres de los rivales para reutilizarlos.
            </p>
          </div>
        </Link>
      </div>

      {/* Partidos Recientes / Pendientes */}
      <div className="rounded-3xl bg-surface border border-surface-border p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Partidos y Actas Recientes</h3>
            <p className="text-xs text-psg-300">
              Haz clic en cualquier partido para rellenar o modificar su acta oficial.
            </p>
          </div>
          <Link href="/admin/partidos">
            <Button variant="outline" size="sm">
              Ver Todos <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-surface-border">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                    {formatShortDate(match.match_date)} · {match.is_home ? "Local" : "Visitante"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {match.is_finished ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-accent-cyan px-2.5 py-1 bg-surface-muted rounded-lg border border-surface-border">
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
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Rellenar Acta
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

