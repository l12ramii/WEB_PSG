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
    <div className="container mx-auto px-4 py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-surface-border text-accent-cyan text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" /> Temporada Regular & Copas
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          Calendario & <span className="text-accent-cyan text-glow">Resultados</span>
        </h1>
        <p className="text-sm sm:text-base text-psg-300">
          Consulta las fechas de los próximos encuentros y el histórico de actas y marcadores del PSG Fútbol 7.
        </p>
      </div>

      {/* Control Bar: Tabs & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-surface-border">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-muted rounded-xl border border-surface-border w-full md:w-auto">
          <button
            onClick={() => setTab("todos")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              tab === "todos"
                ? "bg-accent-electric text-white shadow-sm"
                : "text-psg-300 hover:text-white"
            }`}
          >
            Todos ({matches.length})
          </button>
          <button
            onClick={() => setTab("proximos")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              tab === "proximos"
                ? "bg-accent-electric text-white shadow-sm"
                : "text-psg-300 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Próximos ({upcomingCount})
          </button>
          <button
            onClick={() => setTab("finalizados")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              tab === "finalizados"
                ? "bg-accent-electric text-white shadow-sm"
                : "text-psg-300 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Resultados ({finishedCount})
          </button>
        </div>

        {/* Competition Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-psg-400" />
          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className="bg-surface-muted border border-surface-border text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-accent-cyan cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-surface/50 border border-surface-border text-psg-400 space-y-3">
          <Calendar className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-base font-bold text-white">No se encontraron partidos</p>
          <p className="text-xs">Prueba seleccionando otro filtro de competición o estado.</p>
        </div>
      )}
    </div>
  );
}

