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
        "relative rounded-2xl bg-surface border border-surface-border p-6 transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-card overflow-hidden",
        match.is_finished && isPsgWin && "border-emerald-500/30",
        match.is_finished && isPsgLoss && "border-rose-500/30"
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-6 border-b border-surface-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Badge variant={match.competition}>
            {getCompetitionLabel(match.competition)}
          </Badge>
          <span className="text-xs text-psg-300 font-semibold uppercase tracking-wider">
            {match.is_home ? "Local (Campo PSG)" : "Visitante"}
          </span>
        </div>

        {match.is_finished ? (
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
              isPsgWin && "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
              isPsgDraw && "bg-amber-500/20 text-amber-300 border-amber-500/40",
              isPsgLoss && "bg-rose-500/20 text-rose-300 border-rose-500/40"
            )}
          >
            {isPsgWin ? "Victoria" : isPsgDraw ? "Empate" : "Derrota"}
          </span>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30">
            Próximo
          </span>
        )}
      </div>

      {/* Teams and Score Section */}
      <div className="grid grid-cols-7 items-center gap-2 sm:gap-4 my-2">
        {/* Team 1 (PSG or Rival depending on home/away) */}
        <div className="col-span-3 flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-psg-600 to-psg-800 border border-accent-cyan/40 p-2 shadow-glow flex items-center justify-center">
            {match.is_home ? (
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-wider">
                PSG
              </span>
            ) : match.rival?.shield_url ? (
              <img
                src={match.rival.shield_url}
                alt={match.rival.name}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <Shield className="w-8 h-8 text-psg-300" />
            )}
          </div>
          <span className="text-sm sm:text-base font-bold text-white truncate max-w-full">
            {match.is_home ? "PSG F7" : match.rival?.name || "Rival"}
          </span>
        </div>

        {/* Center: Score or VS */}
        <div className="col-span-1 flex flex-col items-center justify-center text-center">
          {match.is_finished ? (
            <div className="flex items-center gap-1 font-mono text-2xl sm:text-3xl font-black text-white">
              <span className={match.is_home ? "text-accent-cyan" : "text-psg-200"}>
                {match.is_home ? match.psg_score : match.rival_score}
              </span>
              <span className="text-psg-500 font-light">-</span>
              <span className={!match.is_home ? "text-accent-cyan" : "text-psg-200"}>
                {!match.is_home ? match.psg_score : match.rival_score}
              </span>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-surface-muted border border-surface-border flex items-center justify-center font-display font-bold text-accent-cyan text-sm shadow-inner">
              VS
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className="col-span-3 flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-muted border border-surface-border p-2 flex items-center justify-center shadow-inner">
            {!match.is_home ? (
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-wider">
                PSG
              </span>
            ) : match.rival?.shield_url ? (
              <img
                src={match.rival.shield_url}
                alt={match.rival.name}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <Shield className="w-8 h-8 text-psg-300" />
            )}
          </div>
          <span className="text-sm sm:text-base font-bold text-white truncate max-w-full">
            {!match.is_home ? "PSG F7" : match.rival?.name || "Rival"}
          </span>
        </div>
      </div>

      {/* Date & Info Footer */}
      <div className="mt-6 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs text-psg-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="capitalize">{formatMatchDate(match.match_date)}</span>
        </div>
      </div>
    </div>
  );
}

