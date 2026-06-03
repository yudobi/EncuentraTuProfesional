import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps {
  children: ReactNode;
  signal?: boolean;
  className?: string;
}

export function Pill({ children, signal = false, className }: PillProps) {
  return <span className={cn("id-pill", signal && "signal", className)}>{children}</span>;
}
