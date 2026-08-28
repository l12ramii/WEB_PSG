import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: "cyan" | "gold" | "emerald" | "crimson" | "blue";
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      glow = false,
      glowColor = "cyan",
      hoverEffect = false,
      children,
      ...props
    },
    ref
  ) => {
    const glowClasses = {
      cyan: "border-accent-cyan/40 shadow-glow-subtle",
      gold: "border-warning/40 shadow-glow-gold",
      emerald: "border-success/40 shadow-glow-emerald",
      crimson: "border-danger/40 shadow-glow-crimson",
      blue: "border-accent-blue/40 shadow-glow-blue",
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base card strictly according to DESIGN_SYSTEM.md:
          // bg-surface (#0A1128), border-white/10, rounded-xl, inner-light, without heavy external shadow
          "relative overflow-hidden rounded-xl border border-white/10 bg-surface inner-light transition-all duration-200 ease-out",
          hoverEffect &&
            "hover:-translate-y-1 hover:border-accent-cyan/50 hover:shadow-glow-subtle",
          glow && glowClasses[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 pb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-secondary font-sans", className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("p-6 pt-2", className)} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-2 border-t border-white/5", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";
