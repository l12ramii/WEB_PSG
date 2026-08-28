import React from "react";
import { Trophy, Target, Sparkles, ShieldCheck, Flame } from "lucide-react";
import { PlayerStatsSummary } from "@/lib/supabase/types";
import { Card } from "@/components/ui/Card";

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
      bgGradient: "from-accent-cyan/15 via-psg-900 to-psg-950",
      borderHover: "hover:border-accent-cyan/60 hover:shadow-glow",
      textColor: "text-accent-cyan",
      badgeColor: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40",
      badge: "PICHICHI DE ORO",
    },
    {
      title: "Máximo Asistente",
      icon: Sparkles,
      statLabel: "Asistencias Clave",
      statValue: topAssistant?.total_assists || 0,
      player: topAssistant,
      bgGradient: "from-emerald-500/15 via-psg-900 to-psg-950",
      borderHover: "hover:border-emerald-400/60 hover:shadow-glow-emerald",
      textColor: "text-emerald-400",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      badge: "MEJOR PLAYMAKER",
    },
    {
      title: "Guante Imbatible",
      icon: ShieldCheck,
      statLabel: "Porterías a Cero",
      statValue: topKeeper?.total_clean_sheets || 0,
      player: topKeeper,
      bgGradient: "from-amber-400/15 via-psg-900 to-psg-950",
      borderHover: "hover:border-amber-400/60 hover:shadow-glow-gold",
      textColor: "text-amber-400",
      badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/40",
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
            className={`rounded-3xl bg-gradient-to-b ${leader.bgGradient} border border-surface-border p-6 shadow-card transition-all duration-300 ${leader.borderHover} group relative flex select-none flex-col justify-between overflow-hidden hover:-translate-y-2`}
          >
            {/* Top illumination line */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div>
              {/* Card Header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-surface-active text-white shadow-inner transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-display text-base font-bold uppercase tracking-wide text-white">
                    {leader.title}
                  </h4>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 font-display text-[10px] font-black tracking-widest ${leader.badgeColor}`}
                >
                  {leader.badge}
                </span>
              </div>

              {/* Player Portrait & Info */}
              <div className="my-3 flex items-center gap-4">
                <div className="w-18 h-18 relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-surface-border bg-psg-950 shadow-lg group-hover:border-white/40 sm:h-20 sm:w-20">
                  {leader.player?.photo_url ? (
                    <img
                      src={leader.player.photo_url}
                      alt={leader.player.nickname}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="font-display text-2xl font-black text-psg-400">
                      #{leader.player?.dorsal}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-display text-[11px] font-bold uppercase tracking-wider text-accent-cyan">
                    Dorsal #{leader.player?.dorsal}
                  </span>
                  <h5 className="font-display text-2xl font-black uppercase tracking-wide text-white transition-colors group-hover:text-accent-cyan">
                    {leader.player?.nickname || "Sin datos"}
                  </h5>
                  <p className="truncate text-xs font-medium text-psg-300">
                    {leader.player?.first_name} {leader.player?.last_name || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Stat Counter Footer */}
            <div className="mt-5 flex items-baseline justify-between border-t border-surface-border/60 pt-4">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-psg-300">
                {leader.statLabel}
              </span>
              <span
                className={`font-display text-4xl font-black ${leader.textColor} text-glow`}
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
