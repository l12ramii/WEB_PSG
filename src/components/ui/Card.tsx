import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: "cyan" | "gold" | "emerald" | "crimson" | "blue";
  hoverEffect?: boolean;
}

export function Card({
  className,
  glow = false,
  glowColor = "cyan",
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  const glowClasses = {
    cyan: "border-accent-cyan/40 shadow-glow",
    gold: "border-amber-400/40 shadow-glow-gold",
    emerald: "border-emerald-400/40 shadow-glow-emerald",
    crimson: "border-rose-400/40 shadow-glow-crimson",
    blue: "border-psg-400/40 shadow-glow-blue",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-surface-border bg-surface/80 p-6 shadow-card backdrop-blur-md transition-all duration-300",
        hoverEffect &&
          "hover:-translate-y-1.5 hover:border-accent-cyan/40 hover:shadow-glow",
        glow && glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {/* Subtle athletic top corner glow line */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent opacity-60" />
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "flex items-center gap-2 font-display text-xl font-bold tracking-wide text-white",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}
