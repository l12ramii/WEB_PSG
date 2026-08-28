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
import { formatMatchDate, getCompetitionLabel, cn, getPositionName } from "@/lib/utils";

export const revalidate = 0;

interface MatchDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
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
  const assistants = match.stats?.filter((s) => s.played && s.assists > 0) || [];
  const yellowCarded = match.stats?.filter((s) => s.played && s.yellow_cards > 0) || [];
  const redCarded = match.stats?.filter((s) => s.played && s.red_cards > 0) || [];
  const cleanSheetKeepers =
    match.stats?.filter(
      (s) => s.played && s.clean_sheet && s.player?.position === "portero"
    ) || [];
  const playedSquad = match.stats?.filter((s) => s.played) || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 pb-28">
      {/* Back button */}
      <Link
        href="/partidos"
        className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-psg-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Calendario & Resultados
      </Link>

      {/* Main Match Header Card */}
      <div className="rounded-3xl bg-card-gradient border border-surface-border p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Top ambient illumination */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div className="flex items-center gap-2">
            <Badge variant={match.competition} dot>
              {getCompetitionLabel(match.competition)}
            </Badge>
            <span className="text-xs font-display font-bold uppercase text-psg-300">
              {match.is_home ? "Local (Campo PSG)" : "Visitante"}
            </span>
          </div>

          <span className="text-xs font-display font-bold uppercase text-accent-cyan tracking-wider capitalize">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        {/* Head-to-Head Arena */}
        <div className="grid grid-cols-7 items-center gap-4 py-6">
          {/* PSG Side */}
          <div className="col-span-3 flex flex-col items-center space-y-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-psg-600 via-psg-700 to-accent-electric border-2 border-accent-cyan flex items-center justify-center shadow-glow">
              <Flame className="w-12 h-12 text-white phoenix-glow" />
            </div>
            <span className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
              PSG F7
            </span>
          </div>

          {/* Scoreline */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {match.is_finished ? (
              <div className="flex items-center gap-2 font-display text-4xl sm:text-6xl font-black text-white">
                <span className={match.is_home ? "text-accent-cyan text-glow" : "text-psg-200"}>
                  {match.psg_score}
                </span>
                <span className="text-psg-500 font-light">:</span>
                <span className={!match.is_home ? "text-accent-cyan text-glow" : "text-psg-200"}>
                  {match.rival_score}
                </span>
              </div>
            ) : (
              <span className="font-display text-2xl font-black text-accent-cyan px-4 py-2 rounded-2xl bg-surface-muted border border-surface-border">
                VS
              </span>
            )}
          </div>

          {/* Rival Side */}
          <div className="col-span-3 flex flex-col items-center space-y-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-surface-muted border-2 border-surface-border flex items-center justify-center overflow-hidden p-3 shadow-inner">
              {match.rival?.shield_url ? (
                <img
                  src={match.rival.shield_url}
                  alt={match.rival.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Shield className="w-10 h-10 text-psg-400" />
              )}
            </div>
            <span className="font-display text-2xl sm:text-3xl font-black uppercase text-white truncate max-w-full">
              {match.rival?.name || "Rival"}
            </span>
          </div>
        </div>

        {/* Outcome banner */}
        {match.is_finished && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-display font-black uppercase tracking-widest border mx-auto">
            <span
              className={cn(
                isPsgWin && "text-emerald-400",
                isPsgDraw && "text-amber-400",
                isPsgLoss && "text-rose-400"
              )}
            >
              {isPsgWin ? "Victoria Oficial del PSG F7" : isPsgDraw ? "Empate en el Marcador" : "Derrota"}
            </span>
          </div>
        )}
      </div>

      {/* Match Events & Stats Section */}
      {match.is_finished ? (
        <div className="space-y-6">
          {/* Scorers and Assists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-card space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-accent-cyan flex items-center gap-2">
                ⚽ Goleadores del Partido
              </h3>
              {scorers.length > 0 ? (
                <div className="space-y-2">
                  {scorers.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-surface-muted border border-surface-border text-sm"
                    >
                      <span className="font-bold text-white">
                        #{s.player?.dorsal} {s.player?.nickname} ({s.player?.first_name})
                      </span>
                      <span className="font-display font-black text-accent-cyan px-3 py-1 rounded-xl bg-accent-cyan/15 text-sm">
                        {s.goals} {s.goals === 1 ? "Gol" : "Goles"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-psg-400 italic">No se registraron goles en este partido.</p>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-surface-border shadow-card space-y-4">
              <h3 className="font-display text-xl font-bold uppercase text-emerald-400 flex items-center gap-2">
                🎯 Asistencias de Gol
              </h3>
              {assistants.length > 0 ? (
                <div className="space-y-2">
                  {assistants.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-surface-muted border border-surface-border text-sm"
                    >
                      <span className="font-bold text-white">
                        #{s.player?.dorsal} {s.player?.nickname} ({s.player?.first_name})
                      </span>
                      <span className="font-display font-black text-emerald-400 px-3 py-1 rounded-xl bg-emerald-500/15 text-sm">
                        {s.assists} {s.assists === 1 ? "Asistencia" : "Asistencias"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-psg-400 italic">Sin asistencias computadas.</p>
              )}
            </div>
          </div>

          {/* Full Lineup */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <h3 className="font-display text-2xl font-black uppercase text-white flex items-center gap-2.5">
                <Users className="w-5 h-5 text-accent-cyan" /> Convocatoria PSG F7 ({playedSquad.length} Jugadores)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {playedSquad.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-black text-accent-cyan">
                      #{s.player?.dorsal}
                    </span>
                    <span className="text-sm font-bold text-white truncate">
                      {s.player?.nickname}
                    </span>
                  </div>
                  <Badge variant={s.player?.position} className="text-[9px] px-2 py-0.5">
                    {getPositionName(s.player?.position).slice(0, 3)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-surface text-center space-y-3">
          <Calendar className="w-12 h-12 mx-auto text-accent-cyan opacity-80" />
          <h3 className="font-display text-2xl font-bold text-white">Partido por Disputar</h3>
          <p className="text-sm text-psg-300 max-w-md mx-auto">
            El acta digital oficial y las estadísticas de los jugadores se cargarán al finalizar el partido.
          </p>
        </div>
      )}
    </div>
  );
}

