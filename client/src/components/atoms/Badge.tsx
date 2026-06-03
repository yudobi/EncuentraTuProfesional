import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeKind = "default" | "verified" | "signal" | "alert" | "ink";

interface BadgeProps {
  children: ReactNode;
  kind?: BadgeKind;
  className?: string;
}

export function Badge({ children, kind = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        kind === "verified" && "verified",
        kind === "signal" && "signal",
        kind === "alert" && "alert",
        kind === "ink" && "ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
