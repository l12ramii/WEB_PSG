import React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block font-sans text-xs font-semibold uppercase tracking-wider text-secondary",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-accent-cyan">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

