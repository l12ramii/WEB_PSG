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
import { PsgShield } from "@/components/ui/PsgShield";
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
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-surface p-6 shadow-xl inner-light sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-primary focus-ring rounded-lg px-2 py-1"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Partidos
          </button>
          <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
            {formatMatchDate(match.match_date)}
          </span>
        </div>

        {/* Tactical Scoreboard HUD (Symmetric & Centered) */}
        <div className="grid grid-cols-1 items-center gap-6 py-6 text-center md:grid-cols-[1fr_auto_1fr]">
          {/* PSG Side */}
          <div className="flex flex-col items-center space-y-3 min-w-0">
            <div className="flex items-center gap-2">
              <PsgShield size="xs" />
              <span className="font-display text-2xl font-black tracking-wide text-primary sm:text-3xl">
                PSG F7
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPsgScore(Math.max(0, psgScore - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-surface-elevated text-lg font-bold text-primary shadow-sm transition-colors hover:border-accent-cyan focus-ring"
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
                className="h-20 w-24 rounded-2xl border-2 border-accent-cyan bg-background text-center font-display text-5xl font-black text-accent-cyan shadow-glow-subtle focus-ring focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-0"
              />
              <button
                type="button"
                onClick={() => setPsgScore(psgScore + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-surface-elevated text-lg font-bold text-primary shadow-sm transition-colors hover:border-accent-cyan focus-ring"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Goles del PSG F7
            </span>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center px-4 flex-shrink-0">
            <span className="font-display text-2xl font-black text-muted">
              VS
            </span>
          </div>

          {/* Rival Side */}
          <div className="flex flex-col items-center space-y-3 min-w-0">
            <div className="flex items-center gap-2 max-w-full">
              {match.rival?.shield_url ? (
                <img
                  src={match.rival.shield_url}
                  alt={match.rival.name}
                  className="h-6 w-6 object-contain flex-shrink-0"
                />
              ) : (
                <Shield className="h-5 w-5 text-muted flex-shrink-0" />
              )}
              <span
                title={match.rival?.name || "Rival"}
                className="truncate font-display text-2xl font-black tracking-wide text-primary sm:text-3xl"
              >
                {match.rival?.name || "Rival"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-surface-elevated text-lg font-bold text-primary shadow-sm transition-colors hover:border-accent-cyan focus-ring"
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
                className="h-20 w-24 rounded-2xl border-2 border-white/10 bg-background text-center font-display text-5xl font-black text-primary shadow-sm focus-ring focus:border-accent-cyan focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-0"
              />
              <button
                type="button"
                onClick={() => handleRivalScoreChange(rivalScore + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-surface-elevated text-lg font-bold text-primary shadow-sm transition-colors hover:border-accent-cyan focus-ring"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="truncate max-w-full font-display text-xs font-bold uppercase tracking-wider text-secondary">
              Goles de {match.rival?.name}
            </span>
          </div>
        </div>

        {/* Score Alignment Helper */}
        {totalPlayerGoals !== psgScore && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/15 p-3.5 text-xs font-medium text-warning">
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
      <div className="space-y-6 rounded-xl border border-white/10 bg-surface p-4 sm:p-6 inner-light">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl font-black uppercase tracking-wide text-primary">
              Convocatoria & Estadísticas Individuales
            </h3>
            <p className="text-xs font-medium text-secondary">
              Marca los jugadores que disputaron el encuentro y añade sus goles,
              asistencias y tarjetas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleAll(true)}
              className="rounded-lg border border-white/10 bg-surface-elevated px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-accent-cyan transition-colors hover:border-accent-cyan/40 focus-ring"
            >
              Concurrieron Todos
            </button>
            <span className="rounded-lg border border-accent-cyan/30 bg-accent-cyan/15 px-3 py-1.5 font-display text-xs font-bold uppercase text-accent-cyan">
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
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  row.played
                    ? "border-white/10 bg-surface-elevated/50 shadow-sm"
                    : "border-white/5 bg-background/40 opacity-50"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center min-w-0">
                  {/* Player Toggle */}
                  <div className="flex min-w-0 sm:min-w-[240px] items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatChange(player.id, "played", !row.played)
                      }
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border transition-colors focus-ring ${
                        row.played
                          ? "border-accent-cyan bg-accent-cyan text-background"
                          : "border-white/10 bg-surface-elevated text-transparent"
                      }`}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </button>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-10 flex-shrink-0 font-display text-lg font-black text-accent-cyan">
                        {(player.position === "entrenador" ||
                          player.position === "utillero") &&
                        player.dorsal === 0
                          ? player.position === "entrenador"
                            ? "DT"
                            : "UTI"
                          : `#${player.dorsal}`}
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate font-display text-base font-bold text-primary">
                          {player.nickname}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant={player.position}>
                            {getPositionName(player.position)}
                          </Badge>
                          {row.clean_sheet && player.position === "portero" && (
                            <span className="py-0.2 rounded border border-warning/30 bg-warning/15 px-1.5 font-display text-[10px] font-bold uppercase text-warning">
                              🛡️ Imbatible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Counters */}
                  {row.played && (
                    <div className="grid flex-1 grid-cols-2 items-center gap-2 sm:gap-3 sm:grid-cols-4">
                      {/* Goles */}
                      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-surface p-2.5 inner-light">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-elevated text-xs font-bold text-primary hover:bg-white/10 focus-ring"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-display text-lg font-black text-primary">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-cyan/20 text-xs font-bold text-accent-cyan hover:bg-accent-cyan/40 focus-ring"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Asistencias */}
                      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-surface p-2.5 inner-light">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-success">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-elevated text-xs font-bold text-primary hover:bg-white/10 focus-ring"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-display text-lg font-black text-primary">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/20 text-xs font-bold text-success hover:bg-success/40 focus-ring"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjetas Amarillas */}
                      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-surface p-2.5 inner-light">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-warning">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-elevated text-xs font-bold text-primary hover:bg-white/10 focus-ring"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-display text-lg font-black text-warning">
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
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/20 text-xs font-bold text-warning hover:bg-warning/40 focus-ring"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tarjeta Roja */}
                      <div className="flex flex-col items-center rounded-xl border border-white/10 bg-surface p-2.5 inner-light">
                        <span className="mb-1 font-display text-[10px] font-bold uppercase text-danger">
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
                          className={`rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-all focus-ring ${
                            row.red_cards > 0
                              ? "bg-danger text-white shadow-glow-crimson"
                              : "bg-surface-elevated text-muted hover:text-primary"
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
      <div className="sticky bottom-6 z-40 flex flex-col items-center justify-between gap-4 rounded-xl border border-accent-cyan/40 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row inner-light">
        <div className="flex items-center gap-3">
          {savedSuccess ? (
            <span className="flex items-center gap-2 font-display text-sm font-bold uppercase text-success">
              <Check className="h-5 w-5" /> ¡Acta oficial guardada y publicada!
            </span>
          ) : (
            <span className="text-xs font-medium text-secondary">
              Al guardar el acta, las estadísticas de la plantilla se
              actualizarán automáticamente.
            </span>
          )}
        </div>

        <Button
          onClick={handleSave}
          isLoading={isSaving}
          size="lg"
          className="w-full min-w-[220px] sm:w-auto shadow-glow-subtle"
        >
          <Save className="h-4 w-4" /> Guardar Acta Oficial
        </Button>
      </div>
    </div>
  );
}
