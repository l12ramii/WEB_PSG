import React from "react";
import Link from "next/link";
import { CalendarPlus, FileSpreadsheet, Edit3, Shield, CheckCircle2 } from "lucide-react";
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Partidos y <span className="text-accent-cyan">Actas Digitales</span>
          </h1>
          <p className="text-xs sm:text-sm text-psg-300">
            Gestiona las actas arbitrales, marcadores y estadísticas de cada encuentro.
          </p>
        </div>

        <Link href="/admin/partidos/nuevo">
          <Button size="md">
            <CalendarPlus className="w-4 h-4" /> Programar Nuevo Partido
          </Button>
        </Link>
      </div>

      {/* Matches List */}
      <div className="rounded-3xl bg-surface border border-surface-border p-6 shadow-card space-y-4">
        <div className="divide-y divide-surface-border">
          {matches.map((match) => (
            <div
              key={match.id}
              className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Match Left Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center flex-shrink-0">
                  {match.rival?.shield_url ? (
                    <img
                      src={match.rival.shield_url}
                      alt={match.rival.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Shield className="w-6 h-6 text-psg-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={match.competition}>
                      {getCompetitionLabel(match.competition)}
                    </Badge>
                    <span className="text-xs text-psg-400 font-semibold uppercase">
                      {match.is_home ? "Local (PSG)" : "Visitante"}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white">
                    PSG Fútbol 7 <span className="text-psg-400 font-normal">vs</span> {match.rival?.name || "Rival"}
                  </h3>

                  <p className="text-xs text-psg-300 font-mono capitalize">
                    {formatMatchDate(match.match_date)}
                  </p>
                </div>
              </div>

              {/* Match Status & Action */}
              <div className="flex items-center gap-4 self-end md:self-center">
                {match.is_finished ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                        Finalizado
                      </span>
                      <span className="font-mono text-xl font-black text-white">
                        {match.psg_score} - {match.rival_score}
                      </span>
                    </div>

                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button variant="secondary" size="sm">
                        <Edit3 className="w-3.5 h-3.5" /> Modificar Acta
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-amber-400 font-semibold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                      Pendiente de Acta
                    </span>

                    <Link href={`/admin/partidos/${match.id}/acta`}>
                      <Button size="sm">
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Rellenar Acta
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

