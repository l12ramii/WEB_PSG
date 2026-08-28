import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-psg-200">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full rounded-lg bg-surface-muted border border-surface-border px-4 py-2.5 text-sm text-white placeholder-psg-400/60 transition-colors focus:border-accent-cyan focus:outline-none focus:ring-1 focus:ring-accent-cyan disabled:opacity-50",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

