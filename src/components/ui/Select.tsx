import React from "react";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      required,
      error,
      success,
      helperText,
      options,
      children,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <Label htmlFor={selectId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-xl border border-white/10 bg-surface-elevated px-4 py-2.5 pr-10 text-sm font-medium text-primary transition-all duration-200 ease-out inner-light hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-accent-cyan/60 disabled:cursor-not-allowed disabled:opacity-50",
              hasError &&
                "border-danger/80 text-primary hover:border-danger focus-visible:ring-danger focus-visible:border-danger",
              hasSuccess &&
                "border-success/80 text-primary hover:border-success focus-visible:ring-success focus-visible:border-success",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-surface-elevated text-primary py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute right-3.5 flex items-center gap-1.5 text-muted">
            {hasError && (
              <AlertCircle className="h-4 w-4 text-danger animate-in fade-in" />
            )}
            {hasSuccess && !hasError && (
              <CheckCircle2 className="h-4 w-4 text-success animate-in fade-in" />
            )}
            {!hasError && !hasSuccess && (
              <ChevronDown className="h-4 w-4 text-secondary" />
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

Select.displayName = "Select";

