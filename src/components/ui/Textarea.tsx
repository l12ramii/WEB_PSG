import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      required,
      error,
      success,
      helperText,
      id,
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-surface-elevated px-4 py-2.5 text-sm font-medium text-primary placeholder:text-muted transition-all duration-200 ease-out inner-light hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-accent-cyan/60 disabled:cursor-not-allowed disabled:opacity-50",
              hasError &&
                "border-danger/80 text-primary hover:border-danger focus-visible:ring-danger focus-visible:border-danger",
              hasSuccess &&
                "border-success/80 text-primary hover:border-success focus-visible:ring-success focus-visible:border-success",
              className
            )}
            {...props}
          />
          <div className="absolute right-3.5 top-3 pointer-events-none">
            {hasError && (
              <AlertCircle className="h-4 w-4 text-danger animate-in fade-in" />
            )}
            {hasSuccess && !hasError && (
              <CheckCircle2 className="h-4 w-4 text-success animate-in fade-in" />
            )}
          </div>
        </div>

        {/* State Messages */}
        {hasError && (
          <p className="flex items-center gap-1 text-xs font-medium text-danger animate-in fade-in">
            {error}
          </p>
        )}
        {hasSuccess && !hasError && (
          <p className="flex items-center gap-1 text-xs font-medium text-success animate-in fade-in">
            {success}
          </p>
        )}
        {helperText && !hasError && !hasSuccess && (
          <p className="text-xs text-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
