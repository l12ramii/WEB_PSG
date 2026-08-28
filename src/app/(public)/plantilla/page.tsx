import React from "react";
import { Users, Shield, Award } from "lucide-react";
import { getPlayerStatsSummary } from "@/lib/data";
import { PlayerCard } from "@/components/public/PlayerCard";
import { PlayerPosition, PlayerStatsSummary } from "@/lib/supabase/types";

export const revalidate = 0;

export default async function PlantillaPage() {
  const players = await getPlayerStatsSummary();

  const sections: {
    title: string;
    position: PlayerPosition;
    description: string;
  }[] = [
    {
      title: "Porteros",
      position: "portero",
      description: "Seguridad bajo palos, reflejos y liderazgo defensivo.",
    },
    {
      title: "Defensas",
      position: "defensa",
      description: "Contundencia en el corte, salida de balón y rigor táctico.",
    },
    {
      title: "Centrocampistas",
      position: "medio",
      description: "Visión de juego, control del ritmo y distribución precisa.",
    },
    {
      title: "Delanteros",
      position: "delantero",
      description: "Movilidad, desmarque y definición de cara a portería.",
    },
  ];

  return (
    <div className="container mx-auto space-y-12 px-4 py-12 pb-24">
      {/* Header Banner */}
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-cyan">
          <Users className="h-3.5 w-3.5" /> Temporada 2026/2027
        </div>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
          Plantilla <span className="text-glow text-accent-cyan">Oficial</span>
        </h1>
        <p className="text-sm text-psg-300 sm:text-base">
          Conoce a los integrantes del PSG Fútbol 7 y sus estadísticas
          individuales acumuladas durante la competición.
        </p>
      </div>

      {/* Position Sections */}
      <div className="space-y-16">
        {sections.map((section) => {
          const positionPlayers = players.filter(
            (p) => p.position === section.position && p.is_active
          );

          return (
            <section key={section.position} className="space-y-6">
              {/* Section Header */}
              <div className="flex flex-col justify-between gap-2 border-b border-surface-border pb-3 sm:flex-row sm:items-baseline">
                <div>
                  <h2 className="flex items-center gap-3 font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent-cyan" />
                    {section.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-psg-400">
                    {section.description}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-psg-300">
                  {positionPlayers.length}{" "}
                  {positionPlayers.length === 1 ? "jugador" : "jugadores"}
                </span>
              </div>

              {/* Grid of Players */}
              {positionPlayers.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {positionPlayers.map((player) => (
                    <PlayerCard key={player.player_id} player={player} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-surface-border bg-surface-muted/50 p-8 text-center text-sm text-psg-400">
                  No hay jugadores registrados en esta posición.
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
