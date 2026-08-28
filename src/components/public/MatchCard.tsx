"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Calendar,
  MapPin,
  Trophy,
  Flame,
  FileSpreadsheet,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { MatchWithRival, MatchDetail } from "@/lib/supabase/types";
import {
  formatMatchDate,
  getCompetitionLabel,
  cn,
  getPositionName,
  getPositionBadgeColor,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getMatchById } from "@/lib/data";

interface MatchCardProps {
  match: MatchWithRival;
  showActaButton?: boolean;
}

export function MatchCard({ match, showActaButton = true }: MatchCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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

  const handleOpenActa = async () => {
    setShowModal(true);
    setLoadingStats(true);
    try {
      const detail = await getMatchById(match.id);
      setMatchDetail(detail);
    } catch {
      // Fallback
    } finally {
      setLoadingStats(false);
    }
  };

  // Group events from match detail
  const scorers =
    matchDetail?.stats?.filter((s) => s.played && s.goals > 0) || [];
  const assistants =
    matchDetail?.stats?.filter((s) => s.played && s.assists > 0) || [];
  const yellowCarded =
    matchDetail?.stats?.filter((s) => s.played && s.yellow_cards > 0) || [];
  const redCarded =
    matchDetail?.stats?.filter((s) => s.played && s.red_cards > 0) || [];
  const cleanSheetKeepers =
    matchDetail?.stats?.filter(
      (s) => s.played && s.clean_sheet && s.player?.position === "portero"
    ) || [];
  const playedSquad = matchDetail?.stats?.filter((s) => s.played) || [];

  return (
    <>
      <div
        onClick={handleOpenActa}
        className={cn(
          "group relative flex cursor-pointer select-none flex-col justify-between overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-glow",
          match.is_finished &&
            isPsgWin &&
            "border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-glow-emerald",
          match.is_finished &&
            isPsgLoss &&
            "border-rose-500/30 hover:border-rose-400/60 hover:shadow-glow-crimson"
        )}
      >
        {/* Top ambient illumination stripe */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

        {/* Header Bar */}
        <div className="mb-6 flex items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant={match.competition} dot>
              {getCompetitionLabel(match.competition)}
            </Badge>
            <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-300">
              {match.is_home ? "Local (Campo PSG)" : "Visitante"}
            </span>
          </div>

          {match.is_finished ? (
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-display text-[10px] font-black uppercase tracking-widest",
                isPsgWin &&
                  "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-glow-emerald",
                isPsgDraw &&
                  "border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-glow-gold",
                isPsgLoss &&
                  "border-rose-500/40 bg-rose-500/20 text-rose-300 shadow-glow-crimson"
              )}
            >
              {isPsgWin ? "Victoria PSG" : isPsgDraw ? "Empate" : "Derrota"}
            </span>
          ) : (
            <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/15 px-3 py-1 font-display text-[10px] font-black uppercase tracking-widest text-accent-cyan shadow-glow">
              Próxima Jornada
            </span>
          )}
        </div>

        {/* Head-to-Head Arena Showcase */}
        <div className="my-4 grid grid-cols-7 items-center gap-3">
          {/* Team 1 */}
          <div className="col-span-3 flex flex-col items-center space-y-2.5 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent-cyan/40 bg-gradient-to-br from-psg-600 to-psg-900 p-2.5 shadow-glow transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
              {match.is_home ? (
                <Flame className="phoenix-glow h-10 w-10 text-white" />
              ) : match.rival?.shield_url ? (
                <img
                  src={match.rival.shield_url}
                  alt={match.rival.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Shield className="h-10 w-10 text-psg-300" />
              )}
            </div>
            <span className="max-w-full truncate font-display text-base font-black uppercase tracking-wide text-white sm:text-lg">
              {match.is_home ? "PSG F7" : match.rival?.name || "Rival"}
            </span>
          </div>

          {/* Center: Score or VS Badge */}
          <div className="col-span-1 flex flex-col items-center justify-center text-center">
            {match.is_finished ? (
              <div className="flex items-center gap-1.5 font-display text-3xl font-black text-white sm:text-4xl">
                <span
                  className={
                    match.is_home
                      ? "text-glow text-accent-cyan"
                      : "text-psg-200"
                  }
                >
                  {match.is_home ? match.psg_score : match.rival_score}
                </span>
                <span className="font-light text-psg-500">:</span>
                <span
                  className={
                    !match.is_home
                      ? "text-glow text-accent-cyan"
                      : "text-psg-200"
                  }
                >
                  {!match.is_home ? match.psg_score : match.rival_score}
                </span>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted font-display text-xs font-black text-accent-cyan shadow-inner">
                VS
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="col-span-3 flex flex-col items-center space-y-2.5 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-surface-border bg-surface-muted p-2.5 shadow-inner transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
              {!match.is_home ? (
                <Flame className="phoenix-glow h-10 w-10 text-white" />
              ) : match.rival?.shield_url ? (
                <img
                  src={match.rival.shield_url}
                  alt={match.rival.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Shield className="h-10 w-10 text-psg-300" />
              )}
            </div>
            <span className="max-w-full truncate font-display text-base font-black uppercase tracking-wide text-white sm:text-lg">
              {!match.is_home ? "PSG F7" : match.rival?.name || "Rival"}
            </span>
          </div>
        </div>

        {/* Match Date Footer & Click Trigger */}
        <div className="mt-4 flex items-center justify-between border-t border-surface-border/60 pt-3 text-xs font-medium text-psg-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-accent-cyan" />
            <span className="capitalize">
              {formatMatchDate(match.match_date)}
            </span>
          </div>

          <div className="flex items-center gap-1 font-display font-bold uppercase tracking-wider text-accent-cyan transition-colors group-hover:text-white">
            <span>{match.is_finished ? "Ver Acta" : "Detalles"}</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIGITAL MATCH SHEET MODAL (ACTA OFICIAL DIGITAL)           */}
      {/* ======================================================== */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          match.is_finished
            ? `Acta Oficial: PSG ${match.psg_score} - ${match.rival_score} ${match.rival?.name}`
            : `Ficha de Partido: PSG vs ${match.rival?.name}`
        }
      >
        <div className="space-y-6">
          {/* Match Scoreline Card */}
          <div className="space-y-4 rounded-2xl border border-surface-border bg-card-gradient p-6 text-center">
            <div className="flex items-center justify-between border-b border-surface-border pb-2 font-display text-xs font-bold uppercase tracking-wider text-psg-300">
              <Badge variant={match.competition} dot>
                {getCompetitionLabel(match.competition)}
              </Badge>
              <span>{formatMatchDate(match.match_date)}</span>
            </div>

            <div className="flex items-center justify-around py-3">
              <div className="flex flex-col items-center space-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan bg-gradient-to-br from-psg-600 to-accent-electric shadow-glow">
                  <Flame className="phoenix-glow h-8 w-8 text-white" />
                </div>
                <span className="font-display text-lg font-black text-white">
                  PSG F7
                </span>
                <span className="text-[10px] font-bold uppercase text-accent-cyan">
                  {match.is_home ? "Local" : "Visitante"}
                </span>
              </div>

              <div className="flex flex-col items-center">
                {match.is_finished ? (
                  <>
                    <div className="flex items-center gap-2 font-display text-4xl font-black tracking-wider text-white sm:text-5xl">
                      <span className="text-glow text-accent-cyan">
                        {match.psg_score}
                      </span>
                      <span className="font-light text-psg-500">:</span>
                      <span>{match.rival_score}</span>
                    </div>
                    <span
                      className={cn(
                        "mt-1 rounded-full border px-2.5 py-0.5 font-display text-[10px] font-black uppercase",
                        isPsgWin &&
                          "border-emerald-500/30 bg-emerald-500/20 text-emerald-300",
                        isPsgDraw &&
                          "border-amber-500/30 bg-amber-500/20 text-amber-300",
                        isPsgLoss &&
                          "border-rose-500/30 bg-rose-500/20 text-rose-300"
                      )}
                    >
                      {isPsgWin
                        ? "Victoria PSG"
                        : isPsgDraw
                          ? "Empate"
                          : "Derrota"}
                    </span>
                  </>
                ) : (
                  <div className="rounded-xl border border-surface-border bg-surface-muted px-4 py-1.5 font-display text-2xl font-black text-accent-cyan">
                    VS
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted p-2">
                  {match.rival?.shield_url ? (
                    <img
                      src={match.rival.shield_url}
                      alt={match.rival.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Shield className="h-7 w-7 text-psg-400" />
                  )}
                </div>
                <span className="max-w-[120px] truncate font-display text-lg font-black text-white">
                  {match.rival?.name || "Rival"}
                </span>
                <span className="text-[10px] font-bold uppercase text-psg-400">
                  {!match.is_home ? "Local" : "Visitante"}
                </span>
              </div>
            </div>
          </div>

          {/* If Match is finished: Show detailed events & sheet */}
          {match.is_finished ? (
            <div className="space-y-5">
              {/* Goalscorers & Assists Section */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Goleadores */}
                <div className="space-y-2.5 rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
                    ⚽ Goleadores del PSG
                  </h4>
                  {scorers.length > 0 ? (
                    <div className="space-y-1.5">
                      {scorers.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between border-b border-surface-border/40 py-1 text-xs last:border-0"
                        >
                          <span className="font-bold text-white">
                            #{s.player?.dorsal} {s.player?.nickname}
                          </span>
                          <span className="rounded bg-accent-cyan/15 px-2 py-0.5 font-display font-black text-accent-cyan">
                            {s.goals} {s.goals === 1 ? "Gol" : "Goles"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-psg-400">
                      Sin goles registrados en el acta.
                    </p>
                  )}
                </div>

                {/* Asistencias */}
                <div className="space-y-2.5 rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-emerald-400">
                    🎯 Asistencias de Gol
                  </h4>
                  {assistants.length > 0 ? (
                    <div className="space-y-1.5">
                      {assistants.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between border-b border-surface-border/40 py-1 text-xs last:border-0"
                        >
                          <span className="font-bold text-white">
                            #{s.player?.dorsal} {s.player?.nickname}
                          </span>
                          <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-display font-black text-emerald-400">
                            {s.assists}{" "}
                            {s.assists === 1 ? "Asistencia" : "Asistencias"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-psg-400">
                      Sin asistencias registradas.
                    </p>
                  )}
                </div>
              </div>

              {/* Disciplinary & Clean Sheet */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Clean Sheet */}
                <div className="space-y-2 rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-amber-400">
                    🛡️ Portería a Cero
                  </h4>
                  {cleanSheetKeepers.length > 0 ? (
                    cleanSheetKeepers.map((s) => (
                      <div
                        key={s.id}
                        className="text-xs font-bold text-amber-300"
                      >
                        #{s.player?.dorsal} {s.player?.nickname} (Imbatible)
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-psg-400">
                      Goles encajados en el encuentro.
                    </p>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-2 rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-psg-300">
                    ⚠️ Amonestaciones & Tarjetas
                  </h4>
                  {yellowCarded.length > 0 || redCarded.length > 0 ? (
                    <div className="space-y-1 text-xs">
                      {yellowCarded.map((s) => (
                        <div
                          key={s.id}
                          className="font-semibold text-amber-300"
                        >
                          🟨 #{s.player?.dorsal} {s.player?.nickname} (
                          {s.yellow_cards} amarillas)
                        </div>
                      ))}
                      {redCarded.map((s) => (
                        <div key={s.id} className="font-bold text-rose-400">
                          🟥 #{s.player?.dorsal} {s.player?.nickname} (Tarjeta
                          Roja)
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400">
                      Juego limpio, sin tarjetas sancionadas.
                    </p>
                  )}
                </div>
              </div>

              {/* Complete Lineup / Convocados */}
              <div className="space-y-3 border-t border-surface-border pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-white">
                    <Users className="h-4 w-4 text-accent-cyan" /> Convocatoria
                    Oficial ({playedSquad.length} Jugadores)
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {playedSquad.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl border border-surface-border bg-surface p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-accent-cyan">
                          #{s.player?.dorsal}
                        </span>
                        <span className="max-w-[100px] truncate font-medium text-white">
                          {s.player?.nickname}
                        </span>
                      </div>
                      <Badge
                        variant={s.player?.position}
                        className="px-1.5 py-0 text-[9px]"
                      >
                        {getPositionName(s.player?.position).slice(0, 3)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 rounded-2xl bg-surface-muted p-6 text-center">
              <Calendar className="mx-auto h-10 w-10 text-accent-cyan opacity-80" />
              <h4 className="font-display text-lg font-bold text-white">
                Partido Programado
              </h4>
              <p className="mx-auto max-w-sm text-xs text-psg-300">
                El acta oficial y las estadísticas individuales se publicarán
                una vez finalizado el encuentro.
              </p>
            </div>
          )}

          {/* Admin Edit Shortcut Footer */}
          <div className="flex items-center justify-between border-t border-surface-border pt-4">
            <span className="text-xs text-psg-400">
              PSG Fútbol 7 · Acta Digital
            </span>
            <Link href={`/admin/partidos/${match.id}/acta`}>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Editar en Backoffice
                CM
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
