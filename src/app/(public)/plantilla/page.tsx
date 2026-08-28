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
    <div className="container mx-auto px-4 py-12 space-y-12 pb-24">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-surface-border text-accent-cyan text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" /> Temporada 2026/2027
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          Plantilla <span className="text-accent-cyan text-glow">Oficial</span>
        </h1>
        <p className="text-sm sm:text-base text-psg-300">
          Conoce a los integrantes del PSG Fútbol 7 y sus estadísticas individuales acumuladas durante la competición.
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
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-surface-border pb-3 gap-2">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
                    {section.title}
                  </h2>
                  <p className="text-xs text-psg-400 mt-0.5">{section.description}</p>
                </div>
                <span className="text-xs font-mono font-bold text-psg-300">
                  {positionPlayers.length} {positionPlayers.length === 1 ? "jugador" : "jugadores"}
                </span>
              </div>

              {/* Grid of Players */}
              {positionPlayers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {positionPlayers.map((player) => (
                    <PlayerCard key={player.player_id} player={player} />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-surface-muted/50 border border-surface-border text-center text-psg-400 text-sm">
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

