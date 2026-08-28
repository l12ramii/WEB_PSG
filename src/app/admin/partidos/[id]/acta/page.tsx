import React from "react";
import { notFound } from "next/navigation";
import { getMatchById, getPlayers } from "@/lib/data";
import { MatchSheetEditor } from "@/components/admin/MatchSheetEditor";

export const revalidate = 0;

interface MatchActaPageProps {
  params: {
    id: string;
  };
}

export default async function MatchActaPage({ params }: MatchActaPageProps) {
  const match = await getMatchById(params.id);
  const allPlayers = await getPlayers();

  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Acta Oficial:{" "}
          <span className="text-accent-cyan">PSG vs {match.rival?.name}</span>
        </h1>
        <p className="text-xs text-psg-300 sm:text-sm">
          Rellena el marcador y los eventos por jugador para actualizar
          automáticamente las estadísticas del equipo.
        </p>
      </div>

      <MatchSheetEditor match={match} allPlayers={allPlayers} />
    </div>
  );
}
