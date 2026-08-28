import React from "react";
import Link from "next/link";
import {
  CalendarPlus,
  FileSpreadsheet,
  Edit3,
  Shield,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { getMatches } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatMatchDate, getCompetitionLabel } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminPartidosPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Partidos y{" "}
            <span className="text-glow text-accent-cyan">Actas Digitales</span>
          </h1>
          <p className="text-xs font-medium text-psg-300 sm:text-sm">
            Gestiona los partidos programados, introduce marcadores y actualiza
            las estadísticas oficiales.
          </p>
        </div>

        <Link href="/admin/partidos/nuevo">
          <Button size="lg" className="shadow-glow">
            <CalendarPlus className="h-4 w-4" /> Programar Nuevo Partido
          </Button>
        </Link>
      </div>

      {/* Matches List */}
      <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
        <div className="divide-y divide-surface-border">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex select-none flex-col justify-between gap-4 py-5 md:flex-row md:items-center"
            >
              {/* Match Details */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-surface-border bg-surface-muted p-2 shadow-sm">
                  {match.rival?.shield_url ? (
                    <img
                      src={match.rival.shield_url}
                      alt={match.rival.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Shield className="h-7 w-7 text-psg-400" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant={match.competition} dot>
                      {getCompetitionLabel(match.competition)}
                    </Badge>
                    <span className="font-display text-xs font-bold uppercase text-psg-300">
                      {match.is_home ? "Local (Campo PSG)" : "Visitante"}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
                    PSG Fútbol 7{" "}
                    <span className="font-normal text-psg-400">vs</span>{" "}
                    {match.rival?.name || "Rival"}
                  </h3>

                  <p className="flex items-center gap-1.5 text-xs font-medium capitalize text-psg-300">
                    <Calendar className="h-3.5 w-3.5 text-accent-cyan" />
                    {formatMatchDate(match.match_date)}
                  </p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-4 self-end md:self-center">
                {match.is_finished ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block font-display text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Acta Cerrada
                      </span>
                      <span className="font-display text-2xl font-black text-white">
                        {match.psg_score} - {match.rival_score}
                      </span>
                    </div>

                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button variant="secondary" size="md">
                        <Edit3 className="h-3.5 w-3.5" /> Modificar Acta
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-amber-400">
                      Pendiente de Acta
                    </span>

                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button size="md" className="shadow-glow">
                        <FileSpreadsheet className="h-4 w-4" /> Rellenar Acta
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
