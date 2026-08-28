import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "portero"
    | "defensa"
    | "medio"
    | "delantero"
    | "liga"
    | "copa"
    | "amistoso"
    | "live"
    | "gold"
    | "emerald";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-active text-psg-200 border-surface-border",
    portero: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm",
    defensa: "bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-sm",
    medio: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm",
    delantero: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm",
    liga: "bg-accent-electric/15 text-accent-cyan border-accent-electric/40 shadow-sm",
    copa: "bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-sm",
    amistoso: "bg-slate-500/15 text-slate-300 border-slate-500/40 shadow-sm",
    live: "bg-accent-crimson/20 text-rose-300 border-accent-crimson/50 animate-pulse shadow-glow-crimson",
    gold: "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-glow-gold",
    emerald:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-glow-emerald",
  };

  const dotColors = {
    default: "bg-psg-400",
    portero: "bg-amber-400",
    defensa: "bg-blue-400",
    medio: "bg-emerald-400",
    delantero: "bg-rose-400",
    liga: "bg-accent-cyan",
    copa: "bg-purple-400",
    amistoso: "bg-slate-400",
    live: "bg-rose-500 animate-ping",
    gold: "bg-amber-300",
    emerald: "bg-emerald-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider backdrop-blur-md",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
