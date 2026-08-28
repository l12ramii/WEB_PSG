import React from "react";
import { Trophy, Target, Sparkles, ShieldCheck } from "lucide-react";
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
      statLabel: "Goles",
      statValue: topScorer?.total_goals || 0,
      player: topScorer,
      color: "from-accent-cyan to-psg-500",
      textColor: "text-accent-cyan",
      badge: "PICHICHI",
    },
    {
      title: "Máximo Asistente",
      icon: Sparkles,
      statLabel: "Asistencias",
      statValue: topAssistant?.total_assists || 0,
      player: topAssistant,
      color: "from-emerald-400 to-emerald-600",
      textColor: "text-emerald-400",
      badge: "PLAYMAKER",
    },
    {
      title: "Porterías a Cero",
      icon: ShieldCheck,
      statLabel: "Imbatibilidad",
      statValue: topKeeper?.total_clean_sheets || 0,
      player: topKeeper,
      color: "from-amber-400 to-amber-600",
      textColor: "text-amber-400",
      badge: "ZAMORA",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {leaders.map((leader) => {
        const Icon = leader.icon;
        return (
          <Card
            key={leader.title}
            hoverEffect
            className="relative flex flex-col justify-between"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${leader.color} flex items-center justify-center font-bold text-psg-950 shadow-sm`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    {leader.title}
                  </h4>
                </div>
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-black tracking-widest text-white">
                  {leader.badge}
                </span>
              </div>

              <div className="my-2 flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-psg-900">
                  {leader.player?.photo_url ? (
                    <img
                      src={leader.player.photo_url}
                      alt={leader.player.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-xl font-bold text-psg-400">
                      #{leader.player?.dorsal}
                    </span>
                  )}
                </div>

                <div>
                  <h5 className="text-lg font-bold text-white">
                    {leader.player?.nickname || "Sin datos"}
                  </h5>
                  <p className="text-xs text-psg-300">
                    Dorsal #{leader.player?.dorsal} ·{" "}
                    {leader.player?.first_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-surface-border pt-4">
              <span className="text-xs font-semibold uppercase text-psg-400">
                {leader.statLabel}
              </span>
              <span
                className={`font-mono text-3xl font-black ${leader.textColor}`}
              >
                {leader.statValue}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
