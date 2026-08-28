import React from "react";
import Link from "next/link";
import {
  CalendarPlus,
  FileSpreadsheet,
  Edit3,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { getMatches } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatMatchDate, getCompetitionLabel } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminPartidosPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Partidos y <span className="text-accent-cyan">Actas Digitales</span>
          </h1>
          <p className="text-xs text-psg-300 sm:text-sm">
            Gestiona las actas arbitrales, marcadores y estadísticas de cada
            encuentro.
          </p>
        </div>

        <Link href="/admin/partidos/nuevo">
          <Button size="md">
            <CalendarPlus className="h-4 w-4" /> Programar Nuevo Partido
          </Button>
        </Link>
      </div>

      {/* Matches List */}
      <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-6 shadow-card">
        <div className="divide-y divide-surface-border">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex flex-col justify-between gap-4 py-5 md:flex-row md:items-center"
            >
              {/* Match Left Info */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted">
                  {match.rival?.shield_url ? (
                    <img
                      src={match.rival.shield_url}
                      alt={match.rival.name}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Shield className="h-6 w-6 text-psg-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={match.competition}>
                      {getCompetitionLabel(match.competition)}
                    </Badge>
                    <span className="text-xs font-semibold uppercase text-psg-400">
                      {match.is_home ? "Local (PSG)" : "Visitante"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white sm:text-lg">
                    PSG Fútbol 7{" "}
                    <span className="font-normal text-psg-400">vs</span>{" "}
                    {match.rival?.name || "Rival"}
                  </h3>

                  <p className="font-mono text-xs capitalize text-psg-300">
                    {formatMatchDate(match.match_date)}
                  </p>
                </div>
              </div>

              {/* Match Status & Action */}
              <div className="flex items-center gap-4 self-end md:self-center">
                {match.is_finished ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[10px] font-bold uppercase text-emerald-400">
                        Finalizado
                      </span>
                      <span className="font-mono text-xl font-black text-white">
                        {match.psg_score} - {match.rival_score}
                      </span>
                    </div>

                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button variant="secondary" size="sm">
                        <Edit3 className="h-3.5 w-3.5" /> Modificar Acta
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                      Pendiente de Acta
                    </span>

                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button size="sm">
                        <FileSpreadsheet className="h-3.5 w-3.5" /> Rellenar
                        Acta
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
