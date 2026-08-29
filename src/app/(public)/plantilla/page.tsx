"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Flame, Loader2 } from "lucide-react";
import {
  Users,
  Search,
  Flame,
  Loader2,
  Shield,
  ShieldCheck,
  Zap,
  Target,
  Briefcase,
} from "lucide-react";
import { getPlayerStatsSummary } from "@/lib/data";
import { PlayerCard } from "@/components/public/PlayerCard";
import { PlayerPosition, PlayerStatsSummary } from "@/lib/supabase/types";
import { sortPlayersByPositionAndDorsal } from "@/lib/utils";

type FilterTab = "todos" | PlayerPosition | "cuerpo-tecnico";
type FilterTab = "todos" | "cuerpo-tecnico" | "portero" | "defensa" | "medio" | "delantero";

interface PositionSectionConfig {
  key: FilterTab;
  label: string;
  positions: PlayerPosition[];
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badgeLabel: string;
}

const POSITION_SECTIONS: PositionSectionConfig[] = [
  {
    key: "cuerpo-tecnico",
    label: "Cuerpo Técnico",
    positions: ["entrenador", "utillero"],
    icon: Briefcase,
    description: "Estrategia, dirección de juego y soporte logístico desde la banda.",
    badgeLabel: "Staff & Dirección",
  },
  {
    key: "portero",
    label: "Porteros",
    positions: ["portero"],
    icon: ShieldCheck,
    description: "Los guardianes bajo palos y la última línea de defensa parisina.",
    badgeLabel: "Portería",
  },
  {
    key: "defensa",
    label: "Defensas",
    positions: ["defensa"],
    icon: Shield,
    description: "Solidez, anticipación, contundencia y jerarquía en la zaga.",
    badgeLabel: "Zaga Defensiva",
  },
  {
    key: "medio",
    label: "Centrocampistas",
    positions: ["medio"],
    icon: Zap,
    description: "Control del ritmo, distribución de juego y dinamismo en la medular.",
    badgeLabel: "Medular / Creación",
  },
  {
    key: "delantero",
    label: "Delanteros",
    positions: ["delantero"],
    icon: Target,
    description: "Definición, movilidad, potencia ofensiva y pegada de cara a portería.",
    badgeLabel: "Ataque & Pegada",
  },
];

export default function PlantillaPage() {
  const [players, setPlayers] = useState<PlayerStatsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPlayerStatsSummary()
      .then((data) => {
        setPlayers(sortPlayersByPositionAndDorsal(data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const positions: { key: FilterTab; label: string }[] = [
  const tabOptions: { key: FilterTab; label: string }[] = [
    { key: "todos", label: "Toda la Plantilla" },
    { key: "cuerpo-tecnico", label: "Cuerpo Técnico" },
    { key: "portero", label: "Porteros" },
    { key: "defensa", label: "Defensas" },
    { key: "medio", label: "Medios" },
    { key: "medio", label: "Centrocampistas" },
    { key: "delantero", label: "Delanteros" },
    { key: "cuerpo-tecnico", label: "Cuerpo Técnico" },
  ];

  // Filter players by tab and search, guaranteeing sorting by position and dorsal
  const filteredPlayers = sortPlayersByPositionAndDorsal(
    players.filter((player) => {
      if (!player.is_active) return false;
  // Helper filter function for search matching
  const matchesSearch = (player: PlayerStatsSummary, query: string) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const matchNickname = player.nickname?.toLowerCase().includes(q);
    const matchFirstName = player.first_name?.toLowerCase().includes(q);
    const matchLastName = player.last_name?.toLowerCase().includes(q);
    const matchDorsal = String(player.dorsal).includes(q);
    const matchPosition = player.position?.toLowerCase().includes(q);
    return (
      matchNickname ||
      matchFirstName ||
      matchLastName ||
      matchDorsal ||
      matchPosition
    );
  };

      if (activeTab === "cuerpo-tecnico") {
        if (player.position !== "entrenador" && player.position !== "utillero") {
          return false;
        }
      } else if (activeTab !== "todos" && player.position !== activeTab) {
        return false;
      }
  // Active players
  const activePlayers = players.filter((p) => p.is_active);

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNickname = player.nickname?.toLowerCase().includes(q);
        const matchFirstName = player.first_name?.toLowerCase().includes(q);
        const matchLastName = player.last_name?.toLowerCase().includes(q);
        const matchDorsal = String(player.dorsal).includes(q);
        const matchPosition = player.position?.toLowerCase().includes(q);
        return (
          matchNickname ||
          matchFirstName ||
          matchLastName ||
          matchDorsal ||
          matchPosition
        );
      }
  // Group players by section according to specs.md order
  const sectionsToRender = POSITION_SECTIONS.filter((sec) => {
    if (activeTab === "todos") return true;
    return activeTab === sec.key;
  }).map((sec) => {
    const groupPlayers = sortPlayersByPositionAndDorsal(
      activePlayers.filter(
        (p) => sec.positions.includes(p.position) && matchesSearch(p, searchQuery)
      )
    );
    return {
      ...sec,
      players: groupPlayers,
    };
  });

      return true;
    })
  const totalMatchingPlayers = sectionsToRender.reduce(
    (acc, sec) => acc + sec.players.length,
    0
  );

  return (
    <div className="container mx-auto space-y-10 px-4 py-12 pb-28">
    <div className="container mx-auto space-y-12 px-4 py-12 pb-28">
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
          oficiales, dorsales y estadísticas acumuladas por posición.
        </p>
      </div>

      {/* Control Panel: Segmented Tabs & Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-4 inner-light backdrop-blur-md md:flex-row">
        {/* Segmented Position Tabs (Mobile Responsive Wrap & Desktop Single Line) */}
        <div className="flex w-full flex-wrap sm:flex-nowrap items-center gap-1.5 rounded-lg border border-white/10 bg-surface-elevated/60 p-1.5 md:w-auto max-w-full">
          {positions.map((pos) => {
        <div className="flex w-full flex-wrap sm:flex-nowrap items-center gap-1.5 rounded-lg border border-white/10 bg-surface-elevated/60 p-1.5 md:w-auto max-w-full overflow-x-auto">
          {tabOptions.map((tab) => {
            const count =
              pos.key === "todos"
                ? players.filter((p) => p.is_active).length
                : pos.key === "cuerpo-tecnico"
                ? players.filter(
                    (p) =>
                      p.is_active &&
                      (p.position === "entrenador" || p.position === "utillero")
              tab.key === "todos"
                ? activePlayers.length
                : tab.key === "cuerpo-tecnico"
                ? activePlayers.filter(
                    (p) => p.position === "entrenador" || p.position === "utillero"
                  ).length
                : players.filter((p) => p.is_active && p.position === pos.key)
                    .length;
                : activePlayers.filter((p) => p.position === tab.key).length;

            const isActive = activeTab === pos.key;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={pos.key}
                onClick={() => setActiveTab(pos.key)}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-ring ${
                  isActive
                    ? "border border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                    : "text-secondary hover:bg-surface-elevated/60 hover:text-primary"
                }`}
              >
                <span>{pos.label}</span>
                <span>{tab.label}</span>
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
            placeholder="Buscar por apodo, nombre o dorsal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-elevated/60 py-2.5 pl-10 pr-4 text-sm font-medium text-primary placeholder-muted transition-colors focus-ring focus:border-accent-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* Squad Grid or Loading / Empty States */}
      {/* Squad Sections with Separating Lines */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-20 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent-cyan" />
          <p className="mt-4 font-display text-sm font-bold uppercase tracking-wider text-secondary">
            Cargando...
            Cargando plantilla oficial...
          </p>
        </div>
      ) : filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.player_id} player={player} />
          ))}
      ) : totalMatchingPlayers > 0 ? (
        <div className="space-y-16">
          {sectionsToRender
            .filter((sec) => sec.players.length > 0)
            .map((section, idx, filteredSections) => {
              const Icon = section.icon;
              const isLast = idx === filteredSections.length - 1;

              return (
                <section key={section.key} className="space-y-6">
                  {/* Position Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-cyan/30 bg-surface-elevated text-accent-cyan shadow-glow-subtle">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="font-display text-2xl font-black uppercase tracking-wide text-primary sm:text-3xl">
                            {section.label}
                          </h2>
                          <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-0.5 font-display text-xs font-bold text-accent-cyan">
                            {section.players.length}{" "}
                            {section.players.length === 1
                              ? section.key === "cuerpo-tecnico"
                                ? "miembro"
                                : "jugador"
                              : section.key === "cuerpo-tecnico"
                              ? "miembros"
                              : "jugadores"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-secondary sm:text-sm font-medium">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section Grid of Player Cards */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {section.players.map((player) => (
                      <PlayerCard key={player.player_id} player={player} />
                    ))}
                  </div>

                  {/* Visual Dividing Line (Specs.md point 2) */}
                  {!isLast && activeTab === "todos" && (
                    <div className="relative pt-8 pb-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex items-center gap-2 bg-background px-4">
                        <div className="h-1 w-1 rounded-full bg-accent-cyan/60" />
                        <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-glow-cyan" />
                        <div className="h-2 w-2 rounded-full border border-accent-cyan bg-surface shadow-glow-cyan" />
                        <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-glow-cyan" />
                        <div className="h-1 w-1 rounded-full bg-accent-cyan/60" />
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-16 text-center">
          <Users className="h-12 w-12 text-muted" />
          <h4 className="mt-3 text-lg font-bold text-primary font-display">
            No se encontraron jugadores
            No se encontraron miembros en la plantilla
          </h4>
          <p className="mt-1 text-sm text-secondary">
            {players.length === 0
              ? "Aún no hay jugadores registrados en la base de datos."
              : "Prueba con otro término de búsqueda o selecciona otra posición."}
              : "Prueba con otro término de búsqueda o selecciona otra categoría."}
          </p>
        </div>
      )}
    </div>
  );
}
