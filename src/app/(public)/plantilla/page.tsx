"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Flame, Loader2 } from "lucide-react";
import { getPlayerStatsSummary } from "@/lib/data";
import { PlayerCard } from "@/components/public/PlayerCard";
import { PlayerPosition, PlayerStatsSummary } from "@/lib/supabase/types";

export default function PlantillaPage() {
  const [players, setPlayers] = useState<PlayerStatsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"todos" | PlayerPosition>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPlayerStatsSummary()
      .then((data) => {
        setPlayers(data);
      })
      .finally(() => {
        setLoading(false);
      });
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
      const matchNickname = player.nickname?.toLowerCase().includes(q);
      const matchFirstName = player.first_name?.toLowerCase().includes(q);
      const matchDorsal = String(player.dorsal).includes(q);
      return matchNickname || matchFirstName || matchDorsal;
    }

    return true;
  });

  return (
    <div className="container mx-auto space-y-10 px-4 py-12 pb-28">
      {/* Header Banner */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/40 bg-surface-elevated/90 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-accent-cyan shadow-glow-subtle">
          <Flame className="h-3.5 w-3.5 text-accent-cyan" /> Roster Oficial ·
          Temporada 2026/27
        </div>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-primary sm:text-6xl">
          Plantilla <span className="text-glow-subtle text-accent-cyan">Oficial</span>
        </h1>
        <p className="mx-auto max-w-xl text-sm font-medium text-secondary sm:text-base">
          Conoce a los guerreros del PSG Fútbol 7. Consulta sus fichas
          oficiales, dorsales y estadísticas acumuladas.
        </p>
      </div>

      {/* Control Panel: Segmented Tabs & Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-4 inner-light backdrop-blur-md md:flex-row">
        {/* Segmented Position Tabs (Mobile Responsive Wrap & Desktop Single Line) */}
        <div className="flex w-full flex-wrap sm:flex-nowrap items-center gap-1.5 rounded-lg border border-white/10 bg-surface-elevated/60 p-1.5 md:w-auto max-w-full">
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
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-ring ${
                  isActive
                    ? "border border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                    : "text-secondary hover:bg-surface-elevated/60 hover:text-primary"
                }`}
              >
                <span>{pos.label}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-accent-cyan/20 text-accent-cyan"
                      : "bg-surface text-secondary"
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
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Buscar por apodo o dorsal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-elevated/60 py-2.5 pl-10 pr-4 text-sm font-medium text-primary placeholder-muted transition-colors focus-ring focus:border-accent-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Squad Grid or Loading / Empty States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent-cyan" />
          <p className="mt-4 font-display text-sm font-bold uppercase tracking-wider text-secondary">
            Cargando plantilla desde Supabase...
          </p>
        </div>
      ) : filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-16 text-center">
          <Users className="h-12 w-12 text-muted" />
          <h4 className="mt-3 text-lg font-bold text-primary font-display">
            No se encontraron jugadores
          </h4>
          <p className="mt-1 text-sm text-secondary">
            {players.length === 0
              ? "Aún no hay jugadores registrados en la base de datos de Supabase."
              : "Prueba con otro término de búsqueda o selecciona otra posición."}
          </p>
        </div>
      )}
    </div>
  );
}
