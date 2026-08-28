"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Save,
  Check,
  Plus,
  Minus,
  AlertCircle,
  Award,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { MatchDetail, Player } from "@/lib/supabase/types";
import { saveMatchSheet } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPositionBadgeColor, getPositionName, formatMatchDate } from "@/lib/utils";

interface MatchSheetEditorProps {
  match: MatchDetail;
  allPlayers: Player[];
}

interface PlayerRowState {
  player_id: string;
  played: boolean;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  clean_sheet: boolean;
}

export function MatchSheetEditor({ match, allPlayers }: MatchSheetEditorProps) {
  const router = useRouter();
  const [psgScore, setPsgScore] = useState<number>(match.psg_score ?? 0);
  const [rivalScore, setRivalScore] = useState<number>(match.rival_score ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize player stats state mapping all active players
  const [playerRows, setPlayerRows] = useState<PlayerRowState[]>(() => {
    return allPlayers.map((player) => {
      const existingStat = match.stats?.find((s) => s.player_id === player.id);
      return {
        player_id: player.id,
        played: existingStat ? existingStat.played : true,
        goals: existingStat ? existingStat.goals : 0,
        assists: existingStat ? existingStat.assists : 0,
        yellow_cards: existingStat ? existingStat.yellow_cards : 0,
        red_cards: existingStat ? existingStat.red_cards : 0,
        clean_sheet: existingStat ? existingStat.clean_sheet : false,
      };
    });
  });

  const handleStatChange = (
    playerId: string,
    field: keyof PlayerRowState,
    value: any
  ) => {
    setPlayerRows((prev) =>
      prev.map((row) => {
        if (row.player_id !== playerId) return row;

        const updated = { ...row, [field]: value };

        // Check clean sheet for goalkeeper
        const player = allPlayers.find((p) => p.id === playerId);
        if (player?.position === "portero") {
          updated.clean_sheet = updated.played && rivalScore === 0;
        }

        return updated;
      })
    );
  };

  // Recalculate goalkeeper clean sheets when rivalScore changes
  const handleRivalScoreChange = (newScore: number) => {
    const val = Math.max(0, newScore);
    setRivalScore(val);
    setPlayerRows((prev) =>
      prev.map((row) => {
        const player = allPlayers.find((p) => p.id === row.player_id);
        if (player?.position === "portero") {
          return {
            ...row,
            clean_sheet: row.played && val === 0,
          };
        }
        return row;
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveMatchSheet(
        match.id,
        psgScore,
        rivalScore,
        playerRows
      );
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        router.push("/admin/partidos");
        router.refresh();
      }, 1200);
    } catch (err) {
      alert("Error al guardar el acta");
    } finally {
      setIsSaving(false);
    }
  };

  // Sum of goals scored in the sheet for validation helper
  const totalPlayerGoals = playerRows
    .filter((r) => r.played)
    .reduce((sum, r) => sum + r.goals, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-surface-border">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-psg-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a partidos
          </button>
          <span className="text-xs text-psg-400 font-mono">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        {/* Big Score Input HUD */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-7 items-center gap-6 text-center">
          {/* PSG Side */}
          <div className="md:col-span-3 flex flex-col items-center space-y-3">
            <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider">
              {match.is_home ? "PSG F7 (Local)" : "PSG F7 (Visitante)"}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPsgScore(Math.max(0, psgScore - 1))}
                className="w-10 h-10 rounded-xl bg-surface-muted border border-surface-border text-white hover:border-accent-cyan flex items-center justify-center font-bold text-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={psgScore}
                onChange={(e) => setPsgScore(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 h-16 text-center font-mono text-4xl font-black text-accent-cyan bg-psg-950 border-2 border-accent-cyan/50 rounded-2xl focus:outline-none focus:border-accent-cyan shadow-glow"
              />
              <button
                type="button"
                onClick={() => setPsgScore(psgScore + 1)}
                className="w-10 h-10 rounded-xl bg-surface-muted border border-surface-border text-white hover:border-accent-cyan flex items-center justify-center font-bold text-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-psg-400">Goles del PSG</span>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-black text-psg-500">VS</span>
          </div>

          {/* Rival Side */}
          <div className="md:col-span-3 flex flex-col items-center space-y-3">
            <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wider truncate max-w-full">
              {match.rival?.name || "Rival"}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore - 1)}
                className="w-10 h-10 rounded-xl bg-surface-muted border border-surface-border text-white hover:border-accent-cyan flex items-center justify-center font-bold text-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                value={rivalScore}
                onChange={(e) => handleRivalScoreChange(parseInt(e.target.value) || 0)}
                className="w-20 h-16 text-center font-mono text-4xl font-black text-white bg-psg-950 border-2 border-surface-border rounded-2xl focus:outline-none focus:border-accent-cyan"
              />
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore + 1)}
                className="w-10 h-10 rounded-xl bg-surface-muted border border-surface-border text-white hover:border-accent-cyan flex items-center justify-center font-bold text-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-psg-400">Goles de {match.rival?.name}</span>
          </div>
        </div>

        {/* Score Alignment Warning */}
        {totalPlayerGoals !== psgScore && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              Aviso: El marcador asigna <strong>{psgScore} goles</strong> al PSG, pero la suma de goles individuales de los jugadores es <strong>{totalPlayerGoals}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Player Roster & Individual Events Table */}
      <div className="rounded-2xl bg-surface border border-surface-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-lg font-bold text-white">Acta Individual de Jugadores</h3>
            <p className="text-xs text-psg-300">
              Marca los jugadores convocados y asigna sus goles, asistencias y tarjetas.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-surface-muted text-accent-cyan border border-surface-border">
            {playerRows.filter((r) => r.played).length} Jugadores Convocados
          </span>
        </div>

        <div className="space-y-3">
          {allPlayers.map((player) => {
            const row = playerRows.find((r) => r.player_id === player.id) || {
              player_id: player.id,
              played: false,
              goals: 0,
              assists: 0,
              yellow_cards: 0,
              red_cards: 0,
              clean_sheet: false,
            };

            return (
              <div
                key={player.id}
                className={`p-4 rounded-xl border transition-all ${
                  row.played
                    ? "bg-surface-muted/90 border-surface-border"
                    : "bg-black/20 border-surface-border/40 opacity-50"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Player Info & Played Checkbox */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <input
                      type="checkbox"
                      id={`played-${player.id}`}
                      checked={row.played}
                      onChange={(e) =>
                        handleStatChange(player.id, "played", e.target.checked)
                      }
                      className="w-5 h-5 rounded bg-psg-950 border-surface-border text-accent-cyan focus:ring-accent-cyan focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-accent-cyan w-8">
                        #{player.dorsal}
                      </span>
                      <div>
                        <label
                          htmlFor={`played-${player.id}`}
                          className="text-sm font-bold text-white cursor-pointer hover:text-accent-cyan transition-colors block"
                        >
                          {player.nickname}
                        </label>
                        <Badge className={getPositionBadgeColor(player.position)}>
                          {getPositionName(player.position)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Counters (Only enabled if played is checked) */}
                  {row.played && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center flex-1">
                      {/* Goles */}
                      <div className="flex flex-col items-center bg-psg-950/60 p-2 rounded-lg border border-surface-border">
                        <span className="text-[10px] uppercase font-bold text-accent-cyan mb-1">
                          ⚽ Goles
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(
                                player.id,
                                "goals",
                                Math.max(0, row.goals - 1)
                              )
                            }
                            className="w-7 h-7 rounded bg-surface hover:bg-surface-hover text-white flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-base font-bold text-white w-5 text-center">
                            {row.goals}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(player.id, "goals", row.goals + 1)
                            }
                            className="w-7 h-7 rounded bg-accent-cyan/20 hover:bg-accent-cyan/30 text-accent-cyan flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Asistencias */}
                      <div className="flex flex-col items-center bg-psg-950/60 p-2 rounded-lg border border-surface-border">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 mb-1">
                          🎯 Asistencias
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(
                                player.id,
                                "assists",
                                Math.max(0, row.assists - 1)
                              )
                            }
                            className="w-7 h-7 rounded bg-surface hover:bg-surface-hover text-white flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-base font-bold text-white w-5 text-center">
                            {row.assists}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(
                                player.id,
                                "assists",
                                row.assists + 1
                              )
                            }
                            className="w-7 h-7 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjetas Amarillas */}
                      <div className="flex flex-col items-center bg-psg-950/60 p-2 rounded-lg border border-surface-border">
                        <span className="text-[10px] uppercase font-bold text-amber-300 mb-1">
                          🟨 Amarillas
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(
                                player.id,
                                "yellow_cards",
                                Math.max(0, row.yellow_cards - 1)
                              )
                            }
                            className="w-7 h-7 rounded bg-surface hover:bg-surface-hover text-white flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-base font-bold text-amber-300 w-5 text-center">
                            {row.yellow_cards}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(
                                player.id,
                                "yellow_cards",
                                Math.min(2, row.yellow_cards + 1)
                              )
                            }
                            className="w-7 h-7 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjeta Roja / Clean sheet indicator */}
                      <div className="flex flex-col items-center bg-psg-950/60 p-2 rounded-lg border border-surface-border">
                        <span className="text-[10px] uppercase font-bold text-rose-400 mb-1">
                          🟥 Roja
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatChange(
                              player.id,
                              "red_cards",
                              row.red_cards === 0 ? 1 : 0
                            )
                          }
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                            row.red_cards > 0
                              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                              : "bg-surface hover:bg-white/10 text-psg-400"
                          }`}
                        >
                          {row.red_cards > 0 ? "EXPULSADO" : "Ninguna"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Save Action Footer */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-psg-950/95 border border-surface-border shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {savedSuccess ? (
            <span className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <Check className="w-5 h-5" /> ¡Acta guardada correctamente!
            </span>
          ) : (
            <span className="text-xs text-psg-300">
              Asegúrate de revisar el marcador final antes de guardar.
            </span>
          )}
        </div>

        <Button
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
          className="min-w-[200px]"
        >
          <Save className="w-4 h-4" /> Guardar Acta Oficial
        </Button>
      </div>
    </div>
  );
}

