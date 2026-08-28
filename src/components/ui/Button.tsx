import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "ghost"
    | "gold"
    | "emerald";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 disabled:opacity-50 disabled:pointer-events-none rounded-xl relative overflow-hidden group select-none";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-psg-500 via-accent-electric to-accent-cyan text-white shadow-glow hover:shadow-glow-lg hover:brightness-110 active:scale-[0.98] border border-accent-cyan/40",
      secondary:
        "bg-surface-hover text-psg-100 hover:bg-surface-active hover:text-white border border-surface-border hover:border-psg-400/50",
      outline:
        "border-2 border-accent-cyan/50 text-accent-cyan bg-accent-cyan/5 hover:bg-accent-cyan/15 hover:border-accent-cyan active:scale-[0.98] shadow-sm hover:shadow-glow",
      danger:
        "bg-gradient-to-r from-rose-600 to-accent-crimson text-white shadow-glow-crimson hover:brightness-110 active:scale-[0.98] border border-rose-500/40",
      ghost:
        "text-psg-300 hover:text-white hover:bg-white/5 active:scale-[0.98]",
      gold: "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-psg-950 shadow-glow-gold hover:brightness-110 active:scale-[0.98] font-black border border-amber-300/60",
      emerald:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-glow-emerald hover:brightness-110 active:scale-[0.98] border border-emerald-400/40",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-4.5 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
      xl: "text-lg px-8 py-4 gap-3",
      icon: "p-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Subtle shine sweep on hover */}
        <span className="pointer-events-none absolute -left-[100%] top-0 h-full w-[50%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[200%]" />

        {isLoading && (
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
