import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Shield,
  Flame,
  ArrowLeft,
  Users,
  Trophy,
  Award,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
import { getMatchById } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  formatMatchDate,
  getCompetitionLabel,
  cn,
  getPositionName,
} from "@/lib/utils";

export const revalidate = 0;

interface MatchDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const match = await getMatchById(params.id);

  if (!match) {
    notFound();
  }

  const isPsgWin =
    match.is_finished &&
    match.psg_score !== null &&
    match.rival_score !== null &&
    match.psg_score > match.rival_score;

  const isPsgDraw =
    match.is_finished &&
    match.psg_score !== null &&
    match.rival_score !== null &&
    match.psg_score === match.rival_score;

  const isPsgLoss =
    match.is_finished &&
    match.psg_score !== null &&
    match.rival_score !== null &&
    match.psg_score < match.rival_score;

  const scorers = match.stats?.filter((s) => s.played && s.goals > 0) || [];
  const assistants =
    match.stats?.filter((s) => s.played && s.assists > 0) || [];
  const yellowCarded =
    match.stats?.filter((s) => s.played && s.yellow_cards > 0) || [];
  const redCarded =
    match.stats?.filter((s) => s.played && s.red_cards > 0) || [];
  const cleanSheetKeepers =
    match.stats?.filter(
      (s) => s.played && s.clean_sheet && s.player?.position === "portero"
    ) || [];
  const playedSquad = match.stats?.filter((s) => s.played) || [];

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12 pb-28">
      {/* Back button */}
      <Link
        href="/partidos"
        className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al Calendario & Resultados
      </Link>

      {/* Main Match Header Card */}
      <div className="relative space-y-6 overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 text-center shadow-2xl sm:p-10">
        {/* Top ambient illumination */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 border-b border-surface-border pb-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Badge variant={match.competition} dot>
              {getCompetitionLabel(match.competition)}
            </Badge>
            <span className="font-display text-xs font-bold uppercase text-psg-300">
              {match.is_home ? "Local (Campo PSG)" : "Visitante"}
            </span>
          </div>

          <span className="font-display text-xs font-bold uppercase capitalize tracking-wider text-accent-cyan">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        {/* Head-to-Head Arena */}
        <div className="grid grid-cols-7 items-center gap-4 py-6">
          {/* PSG Side */}
          <div className="col-span-3 flex flex-col items-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-accent-cyan bg-gradient-to-br from-psg-600 via-psg-700 to-accent-electric shadow-glow sm:h-24 sm:w-24">
              <Flame className="phoenix-glow h-12 w-12 text-white" />
            </div>
            <span className="font-display text-2xl font-black uppercase text-white sm:text-3xl">
              PSG F7
            </span>
          </div>

          {/* Scoreline */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {match.is_finished ? (
              <div className="flex items-center gap-2 font-display text-4xl font-black text-white sm:text-6xl">
                <span
                  className={
                    match.is_home
                      ? "text-glow text-accent-cyan"
                      : "text-psg-200"
                  }
                >
                  {match.psg_score}
                </span>
                <span className="font-light text-psg-500">:</span>
                <span
                  className={
                    !match.is_home
                      ? "text-glow text-accent-cyan"
                      : "text-psg-200"
                  }
                >
                  {match.rival_score}
                </span>
              </div>
            ) : (
              <span className="rounded-2xl border border-surface-border bg-surface-muted px-4 py-2 font-display text-2xl font-black text-accent-cyan">
                VS
              </span>
            )}
          </div>

          {/* Rival Side */}
          <div className="col-span-3 flex flex-col items-center space-y-3">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-2 border-surface-border bg-surface-muted p-3 shadow-inner sm:h-24 sm:w-24">
              {match.rival?.shield_url ? (
                <img
                  src={match.rival.shield_url}
                  alt={match.rival.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Shield className="h-10 w-10 text-psg-400" />
              )}
            </div>
            <span className="max-w-full truncate font-display text-2xl font-black uppercase text-white sm:text-3xl">
              {match.rival?.name || "Rival"}
            </span>
          </div>
        </div>

        {/* Outcome banner */}
        {match.is_finished && (
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest">
            <span
              className={cn(
                isPsgWin && "text-emerald-400",
                isPsgDraw && "text-amber-400",
                isPsgLoss && "text-rose-400"
              )}
            >
              {isPsgWin
                ? "Victoria Oficial del PSG F7"
                : isPsgDraw
                  ? "Empate en el Marcador"
                  : "Derrota"}
            </span>
          </div>
        )}
      </div>

      {/* Match Events & Stats Section */}
      {match.is_finished ? (
        <div className="space-y-6">
          {/* Scorers and Assists */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-card">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase text-accent-cyan">
                ⚽ Goleadores del Partido
              </h3>
              {scorers.length > 0 ? (
                <div className="space-y-2">
                  {scorers.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-2xl border border-surface-border bg-surface-muted p-3 text-sm"
                    >
                      <span className="font-bold text-white">
                        #{s.player?.dorsal} {s.player?.nickname} (
                        {s.player?.first_name})
                      </span>
                      <span className="rounded-xl bg-accent-cyan/15 px-3 py-1 font-display text-sm font-black text-accent-cyan">
                        {s.goals} {s.goals === 1 ? "Gol" : "Goles"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-psg-400">
                  No se registraron goles en este partido.
                </p>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-card">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold uppercase text-emerald-400">
                🎯 Asistencias de Gol
              </h3>
              {assistants.length > 0 ? (
                <div className="space-y-2">
                  {assistants.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-2xl border border-surface-border bg-surface-muted p-3 text-sm"
                    >
                      <span className="font-bold text-white">
                        #{s.player?.dorsal} {s.player?.nickname} (
                        {s.player?.first_name})
                      </span>
                      <span className="rounded-xl bg-emerald-500/15 px-3 py-1 font-display text-sm font-black text-emerald-400">
                        {s.assists}{" "}
                        {s.assists === 1 ? "Asistencia" : "Asistencias"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-psg-400">
                  Sin asistencias computadas.
                </p>
              )}
            </div>
          </div>

          {/* Full Lineup */}
          <div className="space-y-6 rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <h3 className="flex items-center gap-2.5 font-display text-2xl font-black uppercase text-white">
                <Users className="h-5 w-5 text-accent-cyan" /> Convocatoria PSG
                F7 ({playedSquad.length} Jugadores)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {playedSquad.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl border border-surface-border bg-surface-muted p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-black text-accent-cyan">
                      #{s.player?.dorsal}
                    </span>
                    <span className="truncate text-sm font-bold text-white">
                      {s.player?.nickname}
                    </span>
                  </div>
                  <Badge
                    variant={s.player?.position}
                    className="px-2 py-0.5 text-[9px]"
                  >
                    {getPositionName(s.player?.position).slice(0, 3)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-3xl bg-surface p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-accent-cyan opacity-80" />
          <h3 className="font-display text-2xl font-bold text-white">
            Partido por Disputar
          </h3>
          <p className="mx-auto max-w-md text-sm text-psg-300">
            El acta digital oficial y las estadísticas de los jugadores se
            cargarán al finalizar el partido.
          </p>
        </div>
      )}
    </div>
  );
}
