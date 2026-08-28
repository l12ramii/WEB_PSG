"use client";

import React from "react";
import { Shield, Calendar, Clock, MapPin, Trophy } from "lucide-react";
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
        "relative overflow-hidden rounded-2xl border border-surface-border bg-surface p-6 transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card",
        match.is_finished && isPsgWin && "border-emerald-500/30",
        match.is_finished && isPsgLoss && "border-rose-500/30"
      )}
    >
      {/* Top Meta Bar */}
      <div className="mb-6 flex items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Badge variant={match.competition}>
            {getCompetitionLabel(match.competition)}
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-psg-300">
            {match.is_home ? "Local (Campo PSG)" : "Visitante"}
          </span>
        </div>

        {match.is_finished ? (
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
              isPsgWin &&
                "border-emerald-500/40 bg-emerald-500/20 text-emerald-300",
              isPsgDraw && "border-amber-500/40 bg-amber-500/20 text-amber-300",
              isPsgLoss && "border-rose-500/40 bg-rose-500/20 text-rose-300"
            )}
          >
            {isPsgWin ? "Victoria" : isPsgDraw ? "Empate" : "Derrota"}
          </span>
        ) : (
          <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent-cyan">
            Próximo
          </span>
        )}
      </div>

      {/* Teams and Score Section */}
      <div className="my-2 grid grid-cols-7 items-center gap-2 sm:gap-4">
        {/* Team 1 (PSG or Rival depending on home/away) */}
        <div className="col-span-3 flex flex-col items-center space-y-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/40 bg-gradient-to-br from-psg-600 to-psg-800 p-2 shadow-glow sm:h-16 sm:w-16">
            {match.is_home ? (
              <span className="font-display text-xl font-bold tracking-wider text-white sm:text-2xl">
                PSG
              </span>
            ) : match.rival?.shield_url ? (
              <img
                src={match.rival.shield_url}
                alt={match.rival.name}
                className="h-full w-full rounded-xl object-contain"
              />
            ) : (
              <Shield className="h-8 w-8 text-psg-300" />
            )}
          </div>
          <span className="max-w-full truncate text-sm font-bold text-white sm:text-base">
            {match.is_home ? "PSG F7" : match.rival?.name || "Rival"}
          </span>
        </div>

        {/* Center: Score or VS */}
        <div className="col-span-1 flex flex-col items-center justify-center text-center">
          {match.is_finished ? (
            <div className="flex items-center gap-1 font-mono text-2xl font-black text-white sm:text-3xl">
              <span
                className={match.is_home ? "text-accent-cyan" : "text-psg-200"}
              >
                {match.is_home ? match.psg_score : match.rival_score}
              </span>
              <span className="font-light text-psg-500">-</span>
              <span
                className={!match.is_home ? "text-accent-cyan" : "text-psg-200"}
              >
                {!match.is_home ? match.psg_score : match.rival_score}
              </span>
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface-muted font-display text-sm font-bold text-accent-cyan shadow-inner">
              VS
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className="col-span-3 flex flex-col items-center space-y-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted p-2 shadow-inner sm:h-16 sm:w-16">
            {!match.is_home ? (
              <span className="font-display text-xl font-bold tracking-wider text-white sm:text-2xl">
                PSG
              </span>
            ) : match.rival?.shield_url ? (
              <img
                src={match.rival.shield_url}
                alt={match.rival.name}
                className="h-full w-full rounded-xl object-contain"
              />
            ) : (
              <Shield className="h-8 w-8 text-psg-300" />
            )}
          </div>
          <span className="max-w-full truncate text-sm font-bold text-white sm:text-base">
            {!match.is_home ? "PSG F7" : match.rival?.name || "Rival"}
          </span>
        </div>
      </div>

      {/* Date & Info Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-surface-border/60 pt-3 text-xs text-psg-300">
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
