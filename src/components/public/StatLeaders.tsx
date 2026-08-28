import React from "react";
import { Trophy, Target, Sparkles, ShieldCheck, User } from "lucide-react";
import { PlayerStatsSummary } from "@/lib/supabase/types";

interface StatLeadersProps {
  topScorer: PlayerStatsSummary;
  topAssistant: PlayerStatsSummary;
  topKeeper: PlayerStatsSummary;
}

export function StatLeaders({
  topScorer,
  topAssistant,
  topKeeper,
}: StatLeadersProps) {
  const leaders = [
    {
      title: "Máximo Goleador",
      icon: Target,
      statLabel: "Goles Totales",
      statValue: topScorer?.total_goals || 0,
      player: topScorer,
      borderHover: "hover:border-accent-cyan/50 hover:shadow-glow-subtle",
      textColor: "text-accent-cyan",
      badgeColor: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40",
      badge: "PICHICHI DE ORO",
    },
    {
      title: "Máximo Asistente",
      icon: Sparkles,
      statLabel: "Asistencias Clave",
      statValue: topAssistant?.total_assists || 0,
      player: topAssistant,
      borderHover: "hover:border-success/50 hover:shadow-glow-emerald",
      textColor: "text-success",
      badgeColor: "bg-success/15 text-success border-success/40",
      badge: "MEJOR PLAYMAKER",
    },
    {
      title: "Guante Imbatible",
      icon: ShieldCheck,
      statLabel: "Porterías a Cero",
      statValue: topKeeper?.total_clean_sheets || 0,
      player: topKeeper,
      borderHover: "hover:border-warning/50 hover:shadow-glow-gold",
      textColor: "text-warning",
      badgeColor: "bg-warning/15 text-warning border-warning/40",
      badge: "TROFEO ZAMORA",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {leaders.map((leader) => {
        const Icon = leader.icon;
        return (
          <div
            key={leader.title}
            className={`group relative flex select-none flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-surface p-6 inner-light transition-all duration-200 ease-out hover:-translate-y-1 ${leader.borderHover}`}
          >
            <div>
              {/* Card Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-surface-elevated text-primary shadow-inner">
                    <Icon className="h-4 w-4 text-accent-cyan" />
                  </div>
                  <h4 className="font-display text-base font-bold uppercase tracking-wide text-primary">
                    {leader.title}
                  </h4>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 font-display text-[10px] font-bold tracking-wider ${leader.badgeColor}`}
                >
                  {leader.badge}
                </span>
              </div>

              {/* Player Portrait & Info */}
              <div className="my-4 flex items-center gap-4">
                <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-surface-elevated shadow-md">
                  {leader.player?.photo_url ? (
                    <img
                      src={leader.player.photo_url}
                      alt={leader.player.nickname}
                      className="h-full w-full object-cover object-top grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <User className="h-8 w-8 text-muted" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-cyan">
                    Dorsal #{leader.player?.dorsal}
                  </span>
                  <h5 className="font-display text-xl font-bold uppercase tracking-wide text-primary transition-colors group-hover:text-accent-cyan">
                    {leader.player?.nickname || "Sin datos"}
                  </h5>
                  <p className="truncate text-xs text-secondary">
                    {leader.player?.first_name} {leader.player?.last_name || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Stat Counter Footer */}
            <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-secondary">
                {leader.statLabel}
              </span>
              <span
                className={`font-display text-4xl font-black ${leader.textColor} text-glow-subtle`}
              >
                {leader.statValue}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
