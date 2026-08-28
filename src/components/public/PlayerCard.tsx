"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Shield, Target, Award, AlertTriangle, CheckCircle2, User } from "lucide-react";
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
        className="group relative cursor-pointer rounded-2xl bg-surface border border-surface-border p-5 transition-all duration-300 hover:border-accent-cyan/40 hover:-translate-y-1.5 hover:shadow-glow overflow-hidden flex flex-col justify-between"
      >
        {/* Dorsal Watermark in Background */}
        <span className="absolute -top-4 -right-2 font-display text-8xl font-black text-white/[0.03] select-none group-hover:text-accent-cyan/[0.07] transition-colors">
          #{player.dorsal}
        </span>

        {/* Top Header */}
        <div className="flex items-start justify-between relative z-10">
          <Badge className={getPositionBadgeColor(player.position)}>
            {getPositionName(player.position)}
          </Badge>
          <span className="font-mono text-lg font-bold text-accent-cyan group-hover:scale-110 transition-transform">
            #{player.dorsal}
          </span>
        </div>

        {/* Player Image / Silhouette */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full border-2 border-surface-border group-hover:border-accent-cyan/60 transition-colors overflow-hidden bg-psg-900 shadow-inner flex items-center justify-center">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.nickname}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-psg-800 text-psg-400">
                <User className="w-12 h-12 text-psg-400" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center relative z-10 mb-4">
          <h4 className="text-lg font-bold text-white tracking-wide group-hover:text-accent-cyan transition-colors">
            {player.nickname}
          </h4>
          <p className="text-xs text-psg-300/80">
            {player.first_name} {player.last_name || ""}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-surface-muted border border-surface-border text-center relative z-10">
          <div>
            <span className="block text-[10px] uppercase font-bold text-psg-400">PJ</span>
            <span className="text-sm font-mono font-bold text-white">{player.matches_played}</span>
          </div>

          {player.position === "portero" ? (
            <>
              <div>
                <span className="block text-[10px] uppercase font-bold text-psg-400">Invicto</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {player.total_clean_sheets}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-psg-400">Tarjetas</span>
                <span className="text-sm font-mono font-bold text-psg-200">
                  {player.total_yellow_cards + player.total_red_cards}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block text-[10px] uppercase font-bold text-psg-400">Goles</span>
                <span className="text-sm font-mono font-bold text-accent-cyan">
                  {player.total_goals}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-psg-400">Asist.</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
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
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-2xl border-2 border-accent-cyan/40 bg-psg-900 overflow-hidden shadow-glow flex-shrink-0 flex items-center justify-center">
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-psg-400" />
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Badge className={getPositionBadgeColor(player.position)}>
                  {getPositionName(player.position)}
                </Badge>
                <span className="font-mono text-sm font-bold text-accent-cyan">
                  Dorsal #{player.dorsal}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{player.nickname}</h3>
              <p className="text-sm text-psg-300">
                {player.first_name} {player.last_name || ""}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Jugador en plantilla activa
              </div>
            </div>
          </div>

          {/* Full Statistics Breakdown */}
          <div className="border-t border-surface-border pt-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-psg-300 mb-3">
              Estadísticas Acumuladas Temporada
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center">
                <span className="text-xs text-psg-400 uppercase font-semibold">Partidos Jugados</span>
                <p className="text-2xl font-mono font-bold text-white mt-1">
                  {player.matches_played}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center">
                <span className="text-xs text-psg-400 uppercase font-semibold">Goles Totales</span>
                <p className="text-2xl font-mono font-bold text-accent-cyan mt-1">
                  {player.total_goals}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center">
                <span className="text-xs text-psg-400 uppercase font-semibold">Asistencias</span>
                <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                  {player.total_assists}
                </p>
              </div>

              {player.position === "portero" && (
                <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center">
                  <span className="text-xs text-psg-400 uppercase font-semibold">Porterías a Cero</span>
                  <p className="text-2xl font-mono font-bold text-amber-400 mt-1">
                    {player.total_clean_sheets}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center">
                <span className="text-xs text-psg-400 uppercase font-semibold">Tarjetas Amarillas</span>
                <p className="text-2xl font-mono font-bold text-amber-300 mt-1">
                  {player.total_yellow_cards}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-surface-border text-center">
                <span className="text-xs text-psg-400 uppercase font-semibold">Tarjetas Rojas</span>
                <p className="text-2xl font-mono font-bold text-rose-400 mt-1">
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

