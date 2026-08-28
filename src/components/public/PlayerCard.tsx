"use client";

import React, { useState } from "react";
import {
  Shield,
  Target,
  Award,
  Sparkles,
  CheckCircle2,
  User,
  ChevronRight,
} from "lucide-react";
import { PlayerStatsSummary } from "@/lib/supabase/types";
import { getPositionName, getPositionBadgeColor } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface PlayerCardProps {
  player: PlayerStatsSummary;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative flex cursor-pointer select-none flex-col justify-between overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 transition-all duration-300 hover:-translate-y-2 hover:border-accent-cyan/60 hover:shadow-glow"
      >
        {/* Giant Watermark Dorsal in Background */}
        <span className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-9xl font-black text-white/[0.03] transition-colors group-hover:text-accent-cyan/[0.08]">
          #{player.dorsal}
        </span>

        {/* Diagonal Tiger Claw Slash Accent */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-accent-cyan/[0.03] to-transparent" />

        {/* Card Header: Position & Dorsal Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <Badge variant={player.position} dot>
            {getPositionName(player.position)}
          </Badge>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-muted font-display text-lg font-black text-accent-cyan shadow-inner transition-colors group-hover:bg-accent-cyan group-hover:text-psg-950">
            #{player.dorsal}
          </div>
        </div>

        {/* Player Portrait */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Glowing Aura Ring */}
          <div className="absolute h-32 w-32 rounded-full bg-accent-cyan/10 blur-xl transition-all group-hover:bg-accent-cyan/25" />

          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-surface-border bg-psg-900 shadow-2xl transition-all duration-300 group-hover:border-accent-cyan sm:h-32 sm:w-32">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.nickname}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-psg-800 to-psg-950 text-psg-400">
                <User className="h-14 w-14 text-psg-400/80" />
              </div>
            )}
          </div>
        </div>

        {/* Player Name and Info */}
        <div className="relative z-10 mb-4 text-center">
          <h4 className="font-display text-2xl font-black uppercase tracking-wide text-white transition-colors group-hover:text-accent-cyan">
            {player.nickname}
          </h4>
          <p className="mt-0.5 truncate text-xs font-medium text-psg-300">
            {player.first_name} {player.last_name || ""}
          </p>
        </div>

        {/* Quick Season Stats Bar */}
        <div className="relative z-10 grid grid-cols-3 gap-2 rounded-2xl border border-surface-border bg-surface-muted/90 px-3 py-3 text-center">
          <div>
            <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-psg-400">
              Partidos
            </span>
            <span className="font-display text-lg font-black text-white">
              {player.matches_played}
            </span>
          </div>

          {player.position === "portero" ? (
            <>
              <div>
                <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Imbatible
                </span>
                <span className="font-display text-lg font-black text-amber-400">
                  {player.total_clean_sheets}
                </span>
              </div>
              <div>
                <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-psg-400">
                  Tarjetas
                </span>
                <span className="font-display text-lg font-black text-psg-200">
                  {player.total_yellow_cards + player.total_red_cards}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                  Goles
                </span>
                <span className="font-display text-lg font-black text-accent-cyan">
                  {player.total_goals}
                </span>
              </div>
              <div>
                <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Asistencias
                </span>
                <span className="font-display text-lg font-black text-emerald-400">
                  {player.total_assists}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Hover Cue */}
        <div className="mt-3 flex items-center justify-center gap-1 font-display text-[11px] font-bold uppercase tracking-wider text-psg-400 transition-colors group-hover:text-accent-cyan">
          <span>Ver Ficha Completa</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Expanded Player Profile Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Ficha Oficial #${player.dorsal}`}
      >
        <div className="space-y-6">
          {/* Header Showcase */}
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-surface-border bg-surface-muted p-4 sm:flex-row">
            <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-accent-cyan bg-psg-950 shadow-glow">
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.nickname}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-psg-400" />
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant={player.position} dot>
                  {getPositionName(player.position)}
                </Badge>
                <span className="rounded bg-white/10 px-2 py-0.5 font-display text-xs font-bold text-accent-cyan">
                  DORSAL #{player.dorsal}
                </span>
              </div>

              <h3 className="font-display text-3xl font-black uppercase tracking-wide text-white">
                {player.nickname}
              </h3>
              <p className="text-sm font-medium text-psg-300">
                Nombre completo: {player.first_name} {player.last_name || ""}
              </p>
              <div className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Jugador Convocable ·
                Temporada 2026/27
              </div>
            </div>
          </div>

          {/* Full Statistics Breakdown */}
          <div className="border-t border-surface-border pt-4">
            <h5 className="mb-4 flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-accent-cyan">
              <Sparkles className="h-4 w-4" /> Desglose Estadístico Acumulado
            </h5>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-surface-border bg-surface-muted p-4 text-center">
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-psg-400">
                  Partidos Jugados
                </span>
                <p className="mt-1 font-display text-3xl font-black text-white">
                  {player.matches_played}
                </p>
              </div>

              <div className="rounded-2xl border border-surface-border bg-surface-muted p-4 text-center">
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-accent-cyan">
                  Goles Marcados
                </span>
                <p className="text-glow mt-1 font-display text-3xl font-black text-accent-cyan">
                  {player.total_goals}
                </p>
              </div>

              <div className="rounded-2xl border border-surface-border bg-surface-muted p-4 text-center">
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Asistencias
                </span>
                <p className="mt-1 font-display text-3xl font-black text-emerald-400">
                  {player.total_assists}
                </p>
              </div>

              {player.position === "portero" && (
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4 text-center">
                  <span className="font-display text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Porterías a Cero
                  </span>
                  <p className="text-glow-gold mt-1 font-display text-3xl font-black text-amber-400">
                    {player.total_clean_sheets}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-surface-border bg-surface-muted p-4 text-center">
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Tarjetas Amarillas
                </span>
                <p className="mt-1 font-display text-3xl font-black text-amber-300">
                  {player.total_yellow_cards}
                </p>
              </div>

              <div className="rounded-2xl border border-surface-border bg-surface-muted p-4 text-center">
                <span className="font-display text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  Tarjetas Rojas
                </span>
                <p className="mt-1 font-display text-3xl font-black text-rose-400">
                  {player.total_red_cards}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
