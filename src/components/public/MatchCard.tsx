"use client";

import React from "react";
import { Shield, Calendar, MapPin, Trophy, Flame } from "lucide-react";
import { MatchWithRival } from "@/lib/supabase/types";
import { formatMatchDate, getCompetitionLabel, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface MatchCardProps {
  match: MatchWithRival;
}

export function MatchCard({ match }: MatchCardProps) {
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

  return (
    <div
      className={cn(
        "group relative flex select-none flex-col justify-between overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 transition-all duration-300 hover:border-accent-cyan/50 hover:shadow-glow",
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
          <Badge variant={match.competition}>
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
        {/* Team 1 (PSG or Rival) */}
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
                  match.is_home ? "text-glow text-accent-cyan" : "text-psg-200"
                }
              >
                {match.is_home ? match.psg_score : match.rival_score}
              </span>
              <span className="font-light text-psg-500">:</span>
              <span
                className={
                  !match.is_home ? "text-glow text-accent-cyan" : "text-psg-200"
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

      {/* Match Date Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-surface-border/60 pt-3 text-xs font-medium text-psg-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-accent-cyan" />
          <span className="capitalize">
            {formatMatchDate(match.match_date)}
          </span>
        </div>
      </div>
    </div>
  );
}
