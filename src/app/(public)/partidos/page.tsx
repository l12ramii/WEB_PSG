"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import { MatchWithRival } from "@/lib/supabase/types";
import { MatchCard } from "@/components/public/MatchCard";
import { getMatches } from "@/lib/data";
import { initialMatches } from "@/lib/mock-data";

export default function PartidosPage() {
  const [matches, setMatches] = useState<MatchWithRival[]>(initialMatches);
  const [tab, setTab] = useState<"todos" | "proximos" | "finalizados">("todos");
  const [competitionFilter, setCompetitionFilter] = useState<string>("todas");
  const [searchRival, setSearchRival] = useState("");

  useEffect(() => {
    getMatches().then(setMatches);
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (tab === "proximos" && m.is_finished) return false;
    if (tab === "finalizados" && !m.is_finished) return false;

    if (competitionFilter !== "todas" && m.competition !== competitionFilter) {
      return false;
    }

    if (searchRival.trim()) {
      const q = searchRival.toLowerCase();
      const rivalMatch = m.rival?.name?.toLowerCase().includes(q);
      return rivalMatch;
    }

    return true;
  });

  const upcomingCount = matches.filter((m) => !m.is_finished).length;
  const finishedCount = matches.filter((m) => m.is_finished).length;

  return (
    <div className="container mx-auto space-y-10 px-4 py-12 pb-28">
      {/* Header */}
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/40 bg-surface-elevated/90 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-accent-cyan shadow-glow-subtle">
          <Calendar className="h-3.5 w-3.5" /> Calendario Oficial & Actas
        </div>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-primary sm:text-6xl">
          Fixture &{" "}
          <span className="text-glow-subtle text-accent-cyan">Marcadores</span>
        </h1>
        <p className="mx-auto max-w-xl text-sm font-medium text-secondary sm:text-base">
          Consulta la programación de los próximos encuentros y el histórico de
          actas y resultados del PSG Fútbol 7.
        </p>
      </div>

      {/* Controls: Segmented Tabs & Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-4 inner-light backdrop-blur-md lg:flex-row">
        {/* Status Tabs */}
        <div className="flex w-full items-center gap-1.5 rounded-lg border border-white/10 bg-surface-elevated/60 p-1.5 lg:w-auto">
          <button
            onClick={() => setTab("todos")}
            className={`flex-1 rounded-md px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-ring lg:flex-initial ${
              tab === "todos"
                ? "border border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                : "text-secondary hover:text-primary"
            }`}
          >
            Todos ({matches.length})
          </button>
          <button
            onClick={() => setTab("proximos")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-ring lg:flex-initial ${
              tab === "proximos"
                ? "border border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-accent-cyan" /> Próximos ({upcomingCount})
          </button>
          <button
            onClick={() => setTab("finalizados")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-ring lg:flex-initial ${
              tab === "finalizados"
                ? "border border-accent-cyan/40 bg-surface-elevated text-primary shadow-glow-subtle"
                : "text-secondary hover:text-primary"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Resultados ({finishedCount})
          </button>
        </div>

        {/* Right Filter Controls */}
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
          {/* Rival search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por rival..."
              value={searchRival}
              onChange={(e) => setSearchRival(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-elevated/60 py-2 pl-9 pr-3 text-xs font-medium text-primary placeholder-muted focus-ring focus:border-accent-cyan focus:outline-none"
            />
          </div>

          {/* Competition select */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Filter className="h-4 w-4 text-muted" />
            <select
              value={competitionFilter}
              onChange={(e) => setCompetitionFilter(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-white/10 bg-surface-elevated px-3 py-2 font-display text-xs font-bold uppercase text-primary focus-ring focus:border-accent-cyan focus:outline-none sm:w-auto"
            >
              <option value="todas">Todas las Competiciones</option>
              <option value="liga">Liga Oficial F7</option>
              <option value="copa">Copa F7</option>
              <option value="amistoso">Amistosos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        /* Empty State (DESIGN_SYSTEM Section 3.2) */
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface py-16 text-center">
          <Calendar className="h-12 w-12 text-muted" />
          <h4 className="mt-3 text-lg font-bold text-primary font-display">
            No se encontraron partidos
          </h4>
          <p className="mt-1 text-sm text-secondary">
            Prueba seleccionando otro filtro de competición o estado.
          </p>
        </div>
      )}
    </div>
  );
}
