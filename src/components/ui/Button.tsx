import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    // Athletic, high-contrast base styles following DESIGN_SYSTEM.md
    const baseStyles =
      "inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none rounded-xl relative overflow-hidden group select-none hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]";

    const variantStyles = {
      // Primary CTA: Athletic Electric Cyan action button
      primary:
        "bg-accent-cyan text-background font-black border border-accent-cyan shadow-glow-subtle hover:bg-accent-cyan/95 hover:border-accent-cyan hover:shadow-glow text-background",
      // Secondary: Deep Dark Neutral Surface with border contrast
      secondary:
        "bg-surface-elevated text-primary hover:bg-surface-elevated/90 hover:text-white border border-white/10 hover:border-accent-cyan/50 inner-light",
      // Outline: High contrast cyan boundary
      outline:
        "border-2 border-accent-cyan/50 text-accent-cyan bg-accent-cyan/5 hover:bg-accent-cyan/15 hover:border-accent-cyan shadow-glow-subtle",
      // Danger: Destructive action state
      danger:
        "bg-danger text-white border border-danger/40 hover:bg-danger/90 hover:border-danger hover:shadow-glow-crimson",
      // Ghost: Subdued action
      ghost:
        "text-secondary hover:text-primary hover:bg-surface-elevated/60 border border-transparent hover:border-white/10",
      // Gold: Highlight / Award action
      gold:
        "bg-warning text-background shadow-glow-gold hover:brightness-110 font-black border border-warning/50",
      // Emerald: Success action
      emerald:
        "bg-success text-white shadow-glow-emerald hover:brightness-110 border border-success/40",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
      md: "text-sm px-4.5 py-2.5 gap-2 rounded-xl",
      lg: "text-base px-6 py-3.5 gap-2.5 rounded-xl",
      xl: "text-lg px-8 py-4 gap-3 rounded-xl",
      icon: "p-2.5 rounded-xl",
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

        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
