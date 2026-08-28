import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "portero" | "defensa" | "medio" | "delantero" | "liga" | "copa" | "amistoso" | "live" | "gold";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-active text-psg-200 border-surface-border",
    portero: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    defensa: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    medio: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    delantero: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    liga: "bg-accent-electric/15 text-accent-cyan border-accent-electric/30",
    copa: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    amistoso: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    live: "bg-rose-600/20 text-rose-400 border-rose-500/40 animate-pulse",
    gold: "bg-amber-400/20 text-amber-300 border-amber-400/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

