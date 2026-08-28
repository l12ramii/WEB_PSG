"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Shield,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  User,
} from "lucide-react";
import { PlayerStatsSummary } from "@/lib/supabase/types";
import { getPositionName, getPositionBadgeColor } from "@/lib/utils";
import { Badge } from "@/lib/../components/ui/Badge";
import { Modal } from "@/lib/../components/ui/Modal";

interface PlayerCardProps {
  player: PlayerStatsSummary;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-surface-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-cyan/40 hover:shadow-glow"
      >
        {/* Dorsal Watermark in Background */}
        <span className="absolute -right-2 -top-4 select-none font-display text-8xl font-black text-white/[0.03] transition-colors group-hover:text-accent-cyan/[0.07]">
          #{player.dorsal}
        </span>

        {/* Top Header */}
        <div className="relative z-10 flex items-start justify-between">
          <Badge className={getPositionBadgeColor(player.position)}>
            {getPositionName(player.position)}
          </Badge>
          <span className="font-mono text-lg font-bold text-accent-cyan transition-transform group-hover:scale-110">
            #{player.dorsal}
          </span>
        </div>

        {/* Player Image / Silhouette */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-surface-border bg-psg-900 shadow-inner transition-colors group-hover:border-accent-cyan/60">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.nickname}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-psg-800 text-psg-400">
                <User className="h-12 w-12 text-psg-400" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="relative z-10 mb-4 text-center">
          <h4 className="text-lg font-bold tracking-wide text-white transition-colors group-hover:text-accent-cyan">
            {player.nickname}
          </h4>
          <p className="text-xs text-psg-300/80">
            {player.first_name} {player.last_name || ""}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-1.5 rounded-xl border border-surface-border bg-surface-muted px-3 py-2.5 text-center">
          <div>
            <span className="block text-[10px] font-bold uppercase text-psg-400">
              PJ
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {player.matches_played}
            </span>
          </div>

          {player.position === "portero" ? (
            <>
              <div>
                <span className="block text-[10px] font-bold uppercase text-psg-400">
                  Invicto
                </span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {player.total_clean_sheets}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-psg-400">
                  Tarjetas
                </span>
                <span className="font-mono text-sm font-bold text-psg-200">
                  {player.total_yellow_cards + player.total_red_cards}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block text-[10px] font-bold uppercase text-psg-400">
                  Goles
                </span>
                <span className="font-mono text-sm font-bold text-accent-cyan">
                  {player.total_goals}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-psg-400">
                  Asist.
                </span>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {player.total_assists}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Ficha de Jugador #${player.dorsal}`}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-accent-cyan/40 bg-psg-900 shadow-glow">
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

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Badge className={getPositionBadgeColor(player.position)}>
                  {getPositionName(player.position)}
                </Badge>
                <span className="font-mono text-sm font-bold text-accent-cyan">
                  Dorsal #{player.dorsal}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {player.nickname}
              </h3>
              <p className="text-sm text-psg-300">
                {player.first_name} {player.last_name || ""}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Jugador en plantilla activa
              </div>
            </div>
          </div>

          {/* Full Statistics Breakdown */}
          <div className="border-t border-surface-border pt-4">
            <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-psg-300">
              Estadísticas Acumuladas Temporada
            </h5>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center">
                <span className="text-xs font-semibold uppercase text-psg-400">
                  Partidos Jugados
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-white">
                  {player.matches_played}
                </p>
              </div>

              <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center">
                <span className="text-xs font-semibold uppercase text-psg-400">
                  Goles Totales
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-accent-cyan">
                  {player.total_goals}
                </p>
              </div>

              <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center">
                <span className="text-xs font-semibold uppercase text-psg-400">
                  Asistencias
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                  {player.total_assists}
                </p>
              </div>

              {player.position === "portero" && (
                <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center">
                  <span className="text-xs font-semibold uppercase text-psg-400">
                    Porterías a Cero
                  </span>
                  <p className="mt-1 font-mono text-2xl font-bold text-amber-400">
                    {player.total_clean_sheets}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center">
                <span className="text-xs font-semibold uppercase text-psg-400">
                  Tarjetas Amarillas
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-amber-300">
                  {player.total_yellow_cards}
                </p>
              </div>

              <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-center">
                <span className="text-xs font-semibold uppercase text-psg-400">
                  Tarjetas Rojas
                </span>
                <p className="mt-1 font-mono text-2xl font-bold text-rose-400">
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
