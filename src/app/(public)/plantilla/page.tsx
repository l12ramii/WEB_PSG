"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Filter, Flame, Sparkles } from "lucide-react";
import { getPlayerStatsSummary } from "@/lib/data";
import { PlayerCard } from "@/components/public/PlayerCard";
import { PlayerPosition, PlayerStatsSummary } from "@/lib/supabase/types";
import { initialStatsSummary } from "@/lib/mock-data";

export default function PlantillaPage() {
  const [players, setPlayers] =
    useState<PlayerStatsSummary[]>(initialStatsSummary);
  const [activeTab, setActiveTab] = useState<"todos" | PlayerPosition>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPlayerStatsSummary().then(setPlayers);
  }, []);

  const positions: { key: "todos" | PlayerPosition; label: string }[] = [
    { key: "todos", label: "Toda la Plantilla" },
    { key: "portero", label: "Porteros" },
    { key: "defensa", label: "Defensas" },
    { key: "medio", label: "Medios" },
    { key: "delantero", label: "Delanteros" },
  ];

  // Filter players by tab and search
  const filteredPlayers = players.filter((player) => {
    if (!player.is_active) return false;

    if (activeTab !== "todos" && player.position !== activeTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNickname = player.nickname.toLowerCase().includes(q);
      const matchFirstName = player.first_name.toLowerCase().includes(q);
      const matchDorsal = String(player.dorsal).includes(q);
      return matchNickname || matchFirstName || matchDorsal;
    }

    return true;
  });

  return (
    <div className="container mx-auto space-y-10 px-4 py-12 pb-28">
      {/* Header Banner */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted px-4 py-1.5 font-display text-xs font-black uppercase tracking-widest text-accent-cyan shadow-glow">
          <Flame className="h-3.5 w-3.5 text-accent-cyan" /> Roster Oficial ·
          Temporada 2026/27
        </div>
        <h1 className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-7xl">
          Plantilla <span className="text-glow text-accent-cyan">Oficial</span>
        </h1>
        <p className="mx-auto max-w-xl text-sm font-medium text-psg-300 sm:text-base">
          Conoce a los guerreros del PSG Fútbol 7. Consulta sus fichas
          oficiales, dorsales y estadísticas acumuladas.
        </p>
      </div>

      {/* Control Panel: Segmented Tabs & Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-surface-border bg-surface p-4 shadow-card backdrop-blur-md md:flex-row">
        {/* Segmented Position Tabs */}
        <div className="flex w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-surface-border bg-surface-muted p-1.5 md:w-auto">
          {positions.map((pos) => {
            const count =
              pos.key === "todos"
                ? players.filter((p) => p.is_active).length
                : players.filter((p) => p.is_active && p.position === pos.key)
                    .length;

            const isActive = activeTab === pos.key;

            return (
              <button
                key={pos.key}
                onClick={() => setActiveTab(pos.key)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "border border-accent-cyan/40 bg-accent-electric text-white shadow-glow"
                    : "text-psg-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{pos.label}</span>
                <span
                  className={`py-0.2 rounded-md px-1.5 text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-black/30 text-psg-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-psg-400" />
          <input
            type="text"
            placeholder="Buscar por apodo o dorsal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm font-medium text-white placeholder-psg-400 transition-colors focus:border-accent-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Squad Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} />
          ))}
        </div>
      ) : (
        <div className="space-y-3 rounded-3xl border border-surface-border bg-surface/40 py-20 text-center text-psg-400">
          <Users className="mx-auto h-12 w-12 opacity-40" />
          <p className="font-display text-xl font-bold text-white">
            No se encontraron jugadores
          </p>
          <p className="text-xs">
            Prueba con otro término de búsqueda o selecciona otra posición.
          </p>
        </div>
      )}
    </div>
  );
}
