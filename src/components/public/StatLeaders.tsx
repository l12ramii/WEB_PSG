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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {leaders.map((leader) => {
        const Icon = leader.icon;
        return (
          <Card
            key={leader.title}
            hoverEffect
            className="flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${leader.color} flex items-center justify-center text-psg-950 font-bold shadow-sm`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {leader.title}
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-black tracking-widest px-2 py-0.5 rounded bg-white/10 text-white">
                  {leader.badge}
                </span>
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="w-16 h-16 rounded-2xl bg-psg-900 border border-surface-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {leader.player?.photo_url ? (
                    <img
                      src={leader.player.photo_url}
                      alt={leader.player.nickname}
                      className="w-full h-full object-cover"
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
                    Dorsal #{leader.player?.dorsal} · {leader.player?.first_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-surface-border flex items-baseline justify-between">
              <span className="text-xs text-psg-400 uppercase font-semibold">
                {leader.statLabel}
              </span>
              <span className={`text-3xl font-mono font-black ${leader.textColor}`}>
                {leader.statValue}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

