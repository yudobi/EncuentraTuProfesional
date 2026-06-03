import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2 text-[15px] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-mute)] focus:border-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
