"use client";

import React, { useState } from "react";
import {
  Shield,
  Target,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { PlayerStatsSummary } from "@/lib/supabase/types";
import { getPositionName, parsePhotoUrls } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PlayerPhotoCarousel } from "@/components/public/PlayerPhotoCarousel";

interface PlayerCardProps {
  player: PlayerStatsSummary;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const [showModal, setShowModal] = useState(false);
  const photos = parsePhotoUrls(player.photo_url);
  const isStaff =
    player.position === "entrenador" || player.position === "utillero";

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative flex cursor-pointer select-none flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-surface p-4 inner-light transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent-cyan/50 hover:shadow-glow-subtle"
      >
        {/* Tiger Claw Slash SVG Watermark */}
        <svg
          viewBox="0 0 100 100"
          fill="currentColor"
          className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 text-accent-cyan opacity-5 transition-opacity duration-300 group-hover:opacity-10"
        >
          <path d="M20 5 C 32 35, 38 65, 12 95 C 26 70, 42 35, 28 5 Z" />
          <path d="M50 2 C 62 35, 68 70, 42 98 C 56 75, 72 38, 58 2 Z" />
          <path d="M80 12 C 92 40, 96 72, 74 96 C 86 75, 100 45, 88 12 Z" />
        </svg>

        {/* Card Header: Position Badge & Dorsal / Role */}
        <div className="relative z-10 flex items-center justify-between">
          <Badge variant={player.position} dot>
            {getPositionName(player.position)}
          </Badge>
          <span className="flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg border border-white/10 bg-surface-elevated font-display text-xs font-black text-accent-cyan transition-colors group-hover:border-accent-cyan/40">
            {isStaff && player.dorsal === 0
              ? player.position === "entrenador"
                ? "DT"
                : "STAFF"
              : `#${player.dorsal}`}
          </span>
        </div>

        {/* Player Official Photo Carousel (Always Full Color, Never Grayscale) */}
        <div className="relative my-3 w-full">
          <PlayerPhotoCarousel photos={photos} alt={player.nickname} />
        </div>

        {/* Player Name and Info */}
        <div className="relative z-10 mb-3 text-center min-w-0">
          <h4 className="truncate font-display text-xl font-bold uppercase tracking-wide text-primary transition-colors group-hover:text-accent-cyan">
            {player.nickname}
          </h4>
          <p className="mt-0.5 truncate text-xs text-secondary">
            {player.first_name} {player.last_name || ""}
          </p>
        </div>

        {/* Quick Season Stats Bar */}
        <div className="relative z-10 grid grid-cols-3 gap-2 rounded-lg border border-white/5 bg-surface-elevated/60 p-2.5 text-center">
          <div>
            <span className="block font-display text-[10px] uppercase tracking-wider text-secondary">
              Partidos
            </span>
            <span className="font-display text-base font-bold text-primary">
              {player.matches_played}
            </span>
          </div>

          {isStaff ? (
            <>
              <div>
                <span className="block font-display text-[10px] uppercase tracking-wider text-accent-cyan">
                  Rol
                </span>
                <span className="font-display text-xs font-bold text-accent-cyan truncate block pt-1">
                  {getPositionName(player.position)}
                </span>
              </div>
              <div>
                <span className="block font-display text-[10px] uppercase tracking-wider text-secondary">
                  Tarjetas
                </span>
                <span className="font-display text-base font-bold text-primary">
                  {player.total_yellow_cards + player.total_red_cards}
                </span>
              </div>
            </>
          ) : player.position === "portero" ? (
            <>
              <div>
                <span className="block font-display text-[10px] uppercase tracking-wider text-warning">
                  Imbatible
                </span>
                <span className="font-display text-base font-bold text-warning">
                  {player.total_clean_sheets}
                </span>
              </div>
              <div>
                <span className="block font-display text-[10px] uppercase tracking-wider text-secondary">
                  Tarjetas
                </span>
                <span className="font-display text-base font-bold text-primary">
                  {player.total_yellow_cards + player.total_red_cards}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="block font-display text-[10px] uppercase tracking-wider text-accent-cyan">
                  Goles
                </span>
                <span className="font-display text-base font-bold text-accent-cyan">
                  {player.total_goals}
                </span>
              </div>
              <div>
                <span className="block font-display text-[10px] uppercase tracking-wider text-success">
                  Asistencias
                </span>
                <span className="font-display text-base font-bold text-success">
                  {player.total_assists}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Hover Cue */}
        <div className="mt-3 flex items-center justify-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-secondary transition-colors group-hover:text-accent-cyan">
          <span>Ver Ficha Completa</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Expanded Profile Modal with Full Photo Gallery */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          isStaff
            ? `Ficha Oficial · ${player.nickname} (${getPositionName(player.position)})`
            : `Ficha Oficial #${player.dorsal} · ${player.nickname}`
        }
      >
        <div className="space-y-6">
          {/* Header Showcase with Carousel */}
          <div className="flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-surface-elevated/40 p-4 sm:flex-row">
            <div className="w-36 sm:w-44 flex-shrink-0">
              <PlayerPhotoCarousel
                photos={photos}
                alt={player.nickname}
                showThumbnails={true}
                isModal={true}
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant={player.position} dot>
                  {getPositionName(player.position)}
                </Badge>
                <span className="rounded-md border border-white/10 bg-surface-elevated px-2 py-0.5 font-display text-xs font-bold text-accent-cyan">
                  {isStaff && player.dorsal === 0
                    ? `CUERPO TÉCNICO`
                    : `DORSAL #${player.dorsal}`}
                </span>
              </div>

              <h3 className="truncate font-display text-2xl font-bold uppercase tracking-wide text-primary sm:text-3xl">
                {player.nickname}
              </h3>
              <p className="text-sm text-secondary">
                Nombre: {player.first_name} {player.last_name || ""}
              </p>
              <div className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-success">
                <CheckCircle2 className="h-4 w-4" />{" "}
                {isStaff
                  ? "Cuerpo Técnico Oficial · PSG F7"
                  : "Jugador en Activo · PSG F7"}
              </div>
            </div>
          </div>

          {/* Full Statistics Breakdown */}
          <div className="border-t border-white/10 pt-4">
            <h5 className="mb-4 flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-widest text-accent-cyan">
              <Sparkles className="h-4 w-4" /> Rendimiento Acumulado de la Temporada
            </h5>
            {isStaff ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
                    Partidos Dirigidos
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-primary sm:text-3xl">
                    {player.matches_played}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
                    Función
                  </span>
                  <p className="mt-1 font-display text-xl font-bold text-accent-cyan sm:text-2xl text-glow-subtle truncate">
                    {getPositionName(player.position)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-success">
                    Temporada
                  </span>
                  <p className="mt-1 font-display text-xl font-bold text-success sm:text-2xl">
                    2026/27
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-warning">
                    Tarjetas Amarillas
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-warning sm:text-3xl">
                    {player.total_yellow_cards}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-danger">
                    Tarjetas Rojas
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-danger sm:text-3xl">
                    {player.total_red_cards}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
                    Disciplina
                  </span>
                  <p className="mt-1 font-display text-base font-bold text-primary sm:text-lg">
                    {player.total_yellow_cards + player.total_red_cards === 0
                      ? "Juego Limpio"
                      : `${player.total_yellow_cards + player.total_red_cards} Tarjetas`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
                    Partidos
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-primary sm:text-3xl">
                    {player.matches_played}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
                    Goles
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-accent-cyan sm:text-3xl text-glow-subtle">
                    {player.total_goals}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-success">
                    Asistencias
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-success sm:text-3xl">
                    {player.total_assists}
                  </p>
                </div>

                {player.position === "portero" && (
                  <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-warning">
                      Porterías a Cero
                    </span>
                    <p className="mt-1 font-display text-2xl font-bold text-warning sm:text-3xl">
                      {player.total_clean_sheets}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-warning">
                    Tarjetas Amarillas
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-warning sm:text-3xl">
                    {player.total_yellow_cards}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-surface-elevated/40 p-4 text-center">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-danger">
                    Tarjetas Rojas
                  </span>
                  <p className="mt-1 font-display text-2xl font-bold text-danger sm:text-3xl">
                    {player.total_red_cards}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

