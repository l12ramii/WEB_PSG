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
import {
  getPositionBadgeColor,
  getPositionName,
  formatMatchDate,
} from "@/lib/utils";

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
      await saveMatchSheet(match.id, psgScore, rivalScore, playerRows);
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
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-card">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-surface-border pb-6 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a partidos
          </button>
          <span className="font-mono text-xs text-psg-400">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        {/* Big Score Input HUD */}
        <div className="grid grid-cols-1 items-center gap-6 py-8 text-center md:grid-cols-7">
          {/* PSG Side */}
          <div className="flex flex-col items-center space-y-3 md:col-span-3">
            <span className="font-display text-2xl font-bold tracking-wider text-white sm:text-3xl">
              {match.is_home ? "PSG F7 (Local)" : "PSG F7 (Visitante)"}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPsgScore(Math.max(0, psgScore - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-muted text-lg font-bold text-white hover:border-accent-cyan"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="0"
                value={psgScore}
                onChange={(e) =>
                  setPsgScore(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="h-16 w-20 rounded-2xl border-2 border-accent-cyan/50 bg-psg-950 text-center font-mono text-4xl font-black text-accent-cyan shadow-glow focus:border-accent-cyan focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPsgScore(psgScore + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-muted text-lg font-bold text-white hover:border-accent-cyan"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-psg-400">Goles del PSG</span>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center md:col-span-1">
            <span className="font-display text-3xl font-black text-psg-500">
              VS
            </span>
          </div>

          {/* Rival Side */}
          <div className="flex flex-col items-center space-y-3 md:col-span-3">
            <span className="max-w-full truncate font-display text-2xl font-bold tracking-wider text-white sm:text-3xl">
              {match.rival?.name || "Rival"}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-muted text-lg font-bold text-white hover:border-accent-cyan"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="0"
                value={rivalScore}
                onChange={(e) =>
                  handleRivalScoreChange(parseInt(e.target.value) || 0)
                }
                className="h-16 w-20 rounded-2xl border-2 border-surface-border bg-psg-950 text-center font-mono text-4xl font-black text-white focus:border-accent-cyan focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-muted text-lg font-bold text-white hover:border-accent-cyan"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-psg-400">
              Goles de {match.rival?.name}
            </span>
          </div>
        </div>

        {/* Score Alignment Warning */}
        {totalPlayerGoals !== psgScore && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              Aviso: El marcador asigna <strong>{psgScore} goles</strong> al
              PSG, pero la suma de goles individuales de los jugadores es{" "}
              <strong>{totalPlayerGoals}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Player Roster & Individual Events Table */}
      <div className="space-y-4 rounded-2xl border border-surface-border bg-surface p-6 shadow-card">
        <div className="flex flex-col items-start justify-between gap-2 border-b border-surface-border pb-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-white">
              Acta Individual de Jugadores
            </h3>
            <p className="text-xs text-psg-300">
              Marca los jugadores convocados y asigna sus goles, asistencias y
              tarjetas.
            </p>
          </div>
          <span className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 font-mono text-xs font-bold text-accent-cyan">
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
                className={`rounded-xl border p-4 transition-all ${
                  row.played
                    ? "border-surface-border bg-surface-muted/90"
                    : "border-surface-border/40 bg-black/20 opacity-50"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  {/* Player Info & Played Checkbox */}
                  <div className="flex min-w-[240px] items-center gap-3">
                    <input
                      type="checkbox"
                      id={`played-${player.id}`}
                      checked={row.played}
                      onChange={(e) =>
                        handleStatChange(player.id, "played", e.target.checked)
                      }
                      className="h-5 w-5 cursor-pointer rounded border-surface-border bg-psg-950 text-accent-cyan focus:ring-accent-cyan focus:ring-offset-0"
                    />
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 font-mono text-sm font-bold text-accent-cyan">
                        #{player.dorsal}
                      </span>
                      <div>
                        <label
                          htmlFor={`played-${player.id}`}
                          className="block cursor-pointer text-sm font-bold text-white transition-colors hover:text-accent-cyan"
                        >
                          {player.nickname}
                        </label>
                        <Badge
                          className={getPositionBadgeColor(player.position)}
                        >
                          {getPositionName(player.position)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Counters (Only enabled if played is checked) */}
                  {row.played && (
                    <div className="grid flex-1 grid-cols-2 items-center gap-3 sm:grid-cols-4">
                      {/* Goles */}
                      <div className="flex flex-col items-center rounded-lg border border-surface-border bg-psg-950/60 p-2">
                        <span className="mb-1 text-[10px] font-bold uppercase text-accent-cyan">
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
                            className="flex h-7 w-7 items-center justify-center rounded bg-surface text-xs font-bold text-white hover:bg-surface-hover"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-mono text-base font-bold text-white">
                            {row.goals}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatChange(
                                player.id,
                                "goals",
                                row.goals + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded bg-accent-cyan/20 text-xs font-bold text-accent-cyan hover:bg-accent-cyan/30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Asistencias */}
                      <div className="flex flex-col items-center rounded-lg border border-surface-border bg-psg-950/60 p-2">
                        <span className="mb-1 text-[10px] font-bold uppercase text-emerald-400">
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
                            className="flex h-7 w-7 items-center justify-center rounded bg-surface text-xs font-bold text-white hover:bg-surface-hover"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-mono text-base font-bold text-white">
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
                            className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/20 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjetas Amarillas */}
                      <div className="flex flex-col items-center rounded-lg border border-surface-border bg-psg-950/60 p-2">
                        <span className="mb-1 text-[10px] font-bold uppercase text-amber-300">
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
                            className="flex h-7 w-7 items-center justify-center rounded bg-surface text-xs font-bold text-white hover:bg-surface-hover"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-mono text-base font-bold text-amber-300">
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
                            className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/20 text-xs font-bold text-amber-300 hover:bg-amber-500/30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjeta Roja / Clean sheet indicator */}
                      <div className="flex flex-col items-center rounded-lg border border-surface-border bg-psg-950/60 p-2">
                        <span className="mb-1 text-[10px] font-bold uppercase text-rose-400">
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
                          className={`rounded px-3 py-1 text-xs font-bold transition-colors ${
                            row.red_cards > 0
                              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                              : "bg-surface text-psg-400 hover:bg-white/10"
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
      <div className="sticky bottom-4 z-30 flex items-center justify-between gap-4 rounded-2xl border border-surface-border bg-psg-950/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          {savedSuccess ? (
            <span className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <Check className="h-5 w-5" /> ¡Acta guardada correctamente!
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
          <Save className="h-4 w-4" /> Guardar Acta Oficial
        </Button>
      </div>
    </div>
  );
}
