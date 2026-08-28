"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Trophy, Filter, CheckCircle2, Clock } from "lucide-react";
import { MatchWithRival, CompetitionType } from "@/lib/supabase/types";
import { MatchCard } from "@/components/public/MatchCard";
import { initialMatches } from "@/lib/mock-data";

export default function PartidosPage() {
  const [matches, setMatches] = useState<MatchWithRival[]>(initialMatches);
  const [tab, setTab] = useState<"todos" | "proximos" | "finalizados">("todos");
  const [competitionFilter, setCompetitionFilter] = useState<string>("todas");

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    // Tab filter
    if (tab === "proximos" && m.is_finished) return false;
    if (tab === "finalizados" && !m.is_finished) return false;

    // Competition filter
    if (competitionFilter !== "todas" && m.competition !== competitionFilter) {
      return false;
    }

    return true;
  });

  const upcomingCount = matches.filter((m) => !m.is_finished).length;
  const finishedCount = matches.filter((m) => m.is_finished).length;

  return (
    <div className="container mx-auto space-y-8 px-4 py-12 pb-24">
      {/* Header */}
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-cyan">
          <Calendar className="h-3.5 w-3.5" /> Temporada Regular & Copas
        </div>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
          Calendario &{" "}
          <span className="text-glow text-accent-cyan">Resultados</span>
        </h1>
        <p className="text-sm text-psg-300 sm:text-base">
          Consulta las fechas de los próximos encuentros y el histórico de actas
          y marcadores del PSG Fútbol 7.
        </p>
      </div>

      {/* Control Bar: Tabs & Filter */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-surface-border bg-surface p-4 md:flex-row">
        {/* Status Tabs */}
        <div className="flex w-full items-center gap-1 rounded-xl border border-surface-border bg-surface-muted p-1 md:w-auto">
          <button
            onClick={() => setTab("todos")}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all md:flex-initial ${
              tab === "todos"
                ? "bg-accent-electric text-white shadow-sm"
                : "text-psg-300 hover:text-white"
            }`}
          >
            Todos ({matches.length})
          </button>
          <button
            onClick={() => setTab("proximos")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all md:flex-initial ${
              tab === "proximos"
                ? "bg-accent-electric text-white shadow-sm"
                : "text-psg-300 hover:text-white"
            }`}
          >
            <Clock className="h-3.5 w-3.5" /> Próximos ({upcomingCount})
          </button>
          <button
            onClick={() => setTab("finalizados")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all md:flex-initial ${
              tab === "finalizados"
                ? "bg-accent-electric text-white shadow-sm"
                : "text-psg-300 hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Resultados ({finishedCount}
            )
          </button>
        </div>

        {/* Competition Dropdown */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Filter className="h-4 w-4 text-psg-400" />
          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-surface-border bg-surface-muted px-3 py-2 text-xs font-semibold text-white focus:border-accent-cyan focus:outline-none"
          >
            <option value="todas">Todas las Competiciones</option>
            <option value="liga">Solo Liga F7</option>
            <option value="copa">Solo Copa</option>
            <option value="amistoso">Solo Amistosos</option>
          </select>
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
        <div className="space-y-3 rounded-3xl border border-surface-border bg-surface/50 py-16 text-center text-psg-400">
          <Calendar className="mx-auto h-12 w-12 opacity-40" />
          <p className="text-base font-bold text-white">
            No se encontraron partidos
          </p>
          <p className="text-xs">
            Prueba seleccionando otro filtro de competición o estado.
          </p>
        </div>
      )}
    </div>
  );
}
