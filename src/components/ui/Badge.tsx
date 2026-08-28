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
    default: "bg-surface-elevated text-secondary border-white/10",
    portero: "bg-warning/15 text-warning border-warning/40",
    defensa: "bg-accent-blue/15 text-accent-blue border-accent-blue/40",
    medio: "bg-success/15 text-success border-success/40",
    delantero: "bg-danger/15 text-danger border-danger/40",
    liga: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40",
    copa: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    amistoso: "bg-slate-500/15 text-slate-300 border-slate-500/40",
    live: "bg-danger/20 text-danger border-danger/50 animate-pulse shadow-glow-crimson",
    gold: "bg-warning/20 text-warning border-warning/50 shadow-glow-gold",
    emerald: "bg-success/20 text-success border-success/50 shadow-glow-emerald",
  };

  const dotColors = {
    default: "bg-secondary",
    portero: "bg-warning",
    defensa: "bg-accent-blue",
    medio: "bg-success",
    delantero: "bg-danger",
    liga: "bg-accent-cyan",
    copa: "bg-purple-400",
    amistoso: "bg-slate-400",
    live: "bg-danger animate-ping",
    gold: "bg-warning",
    emerald: "bg-success",
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
