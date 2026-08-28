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
  Users,
  Flame,
  CheckSquare,
  Square,
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

        const player = allPlayers.find((p) => p.id === playerId);
        if (player?.position === "portero") {
          updated.clean_sheet = updated.played && rivalScore === 0;
        }

        return updated;
      })
    );
  };

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

  const handleToggleAll = (playedState: boolean) => {
    setPlayerRows((prev) =>
      prev.map((row) => ({
        ...row,
        played: playedState,
        clean_sheet:
          playedState &&
          rivalScore === 0 &&
          allPlayers.find((p) => p.id === row.player_id)?.position ===
            "portero",
      }))
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

  const totalPlayerGoals = playerRows
    .filter((r) => r.played)
    .reduce((sum, r) => sum + r.goals, 0);

  const convocadosCount = playerRows.filter((r) => r.played).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24">
      {/* Top Banner & Score HUD */}
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-card-gradient p-6 shadow-card sm:p-8">
        {/* Top ambient illumination */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 border-b border-surface-border pb-6 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-psg-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Partidos
          </button>
          <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        {/* Tactical Scoreboard HUD */}
        <div className="grid grid-cols-1 items-center gap-6 py-8 text-center md:grid-cols-7">
          {/* PSG Side */}
          <div className="flex flex-col items-center space-y-3 md:col-span-3">
            <div className="flex items-center gap-2">
              <Flame className="phoenix-glow h-5 w-5 text-accent-cyan" />
              <span className="font-display text-2xl font-black tracking-wide text-white sm:text-3xl">
                PSG F7
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPsgScore(Math.max(0, psgScore - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted text-lg font-bold text-white shadow-sm transition-colors hover:border-accent-cyan"
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
                className="h-20 w-24 rounded-3xl border-2 border-accent-cyan bg-psg-950 text-center font-display text-5xl font-black text-accent-cyan shadow-glow focus:border-accent-cyan focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPsgScore(psgScore + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted text-lg font-bold text-white shadow-sm transition-colors hover:border-accent-cyan"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-psg-400">
              Goles del PSG F7
            </span>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center md:col-span-1">
            <span className="font-display text-3xl font-black text-psg-500">
              VS
            </span>
          </div>

          {/* Rival Side */}
          <div className="flex flex-col items-center space-y-3 md:col-span-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-psg-400" />
              <span className="max-w-full truncate font-display text-2xl font-black tracking-wide text-white sm:text-3xl">
                {match.rival?.name || "Rival"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted text-lg font-bold text-white shadow-sm transition-colors hover:border-accent-cyan"
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
                className="h-20 w-24 rounded-3xl border-2 border-surface-border bg-psg-950 text-center font-display text-5xl font-black text-white shadow-sm focus:border-accent-cyan focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted text-lg font-bold text-white shadow-sm transition-colors hover:border-accent-cyan"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="max-w-full truncate font-display text-xs font-bold uppercase tracking-wider text-psg-400">
              Goles de {match.rival?.name}
            </span>
          </div>
        </div>

        {/* Score Alignment Helper */}
        {totalPlayerGoals !== psgScore && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/15 p-3.5 text-xs font-medium text-amber-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>
              Aviso: El marcador asigna <strong>{psgScore} goles</strong> al
              PSG, pero la suma de goles individuales anotados en el acta es{" "}
              <strong>{totalPlayerGoals}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Squad Attendance & Event Steppers */}
      <div className="space-y-6 rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-surface-border pb-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl font-black uppercase tracking-wide text-white">
              Convocatoria & Estadísticas Individuales
            </h3>
            <p className="text-xs font-medium text-psg-300">
              Marca los jugadores que disputaron el encuentro y añade sus goles,
              asistencias y tarjetas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleAll(true)}
              className="rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-accent-cyan transition-colors hover:bg-surface-active"
            >
              Concurrieron Todos
            </button>
            <span className="rounded-xl border border-accent-cyan/30 bg-accent-cyan/15 px-3 py-1.5 font-display text-xs font-bold uppercase text-accent-cyan">
              {convocadosCount} Convocados
            </span>
          </div>
        </div>

        {/* Players List */}
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
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  row.played
                    ? "border-surface-border bg-surface-muted/90 shadow-sm"
                    : "border-surface-border/40 bg-psg-950/40 opacity-50"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  {/* Player Toggle */}
                  <div className="flex min-w-[260px] items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatChange(player.id, "played", !row.played)
                      }
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors ${
                        row.played
                          ? "border-accent-cyan bg-accent-cyan text-psg-950"
                          : "border-surface-border bg-surface-active text-transparent"
                      }`}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </button>

                    <div className="flex items-center gap-2.5">
                      <span className="w-8 font-display text-lg font-black text-accent-cyan">
                        #{player.dorsal}
                      </span>
                      <div>
                        <span className="block font-display text-base font-bold text-white">
                          {player.nickname}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={player.position}>
                            {getPositionName(player.position)}
                          </Badge>
                          {row.clean_sheet && player.position === "portero" && (
                            <span className="py-0.2 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 font-display text-[10px] font-bold uppercase text-amber-400">
                              🛡️ Imbatible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Counters */}
                  {row.played && (
                    <div className="grid flex-1 grid-cols-2 items-center gap-3 sm:grid-cols-4">
                      {/* Goles */}
                      <div className="flex flex-col items-center rounded-xl border border-surface-border bg-psg-950 p-2.5">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-accent-cyan">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-hover text-xs font-bold text-white hover:bg-surface-active"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-display text-lg font-black text-white">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-cyan/20 text-xs font-bold text-accent-cyan hover:bg-accent-cyan/40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Asistencias */}
                      <div className="flex flex-col items-center rounded-xl border border-surface-border bg-psg-950 p-2.5">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-emerald-400">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-hover text-xs font-bold text-white hover:bg-surface-active"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-display text-lg font-black text-white">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-300 hover:bg-emerald-500/40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjetas Amarillas */}
                      <div className="flex flex-col items-center rounded-xl border border-surface-border bg-psg-950 p-2.5">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-amber-300">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-hover text-xs font-bold text-white hover:bg-surface-active"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-display text-lg font-black text-amber-300">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold text-amber-300 hover:bg-amber-500/40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjeta Roja */}
                      <div className="flex flex-col items-center rounded-xl border border-surface-border bg-psg-950 p-2.5">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-rose-400">
                          🟥 Tarjeta Roja
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
                          className={`rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-all ${
                            row.red_cards > 0
                              ? "bg-rose-600 text-white shadow-glow-crimson"
                              : "bg-surface-muted text-psg-400 hover:bg-surface-hover"
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

      {/* Floating Save Action Bar */}
      <div className="sticky bottom-6 z-40 flex flex-col items-center justify-between gap-4 rounded-3xl border-2 border-accent-cyan/40 bg-psg-950/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row">
        <div className="flex items-center gap-3">
          {savedSuccess ? (
            <span className="flex items-center gap-2 font-display text-sm font-bold uppercase text-emerald-400">
              <Check className="h-5 w-5" /> ¡Acta oficial guardada y publicada!
            </span>
          ) : (
            <span className="text-xs font-medium text-psg-300">
              Al guardar el acta, las estadísticas de la plantilla se
              actualizarán automáticamente.
            </span>
          )}
        </div>

        <Button
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
          className="w-full min-w-[220px] sm:w-auto"
        >
          <Save className="h-4 w-4" /> Guardar Acta Oficial
        </Button>
      </div>
    </div>
  );
}
