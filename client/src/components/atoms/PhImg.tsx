import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhImgProps {
  label?: string;
  ratio?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function PhImg({
  label = "imagen",
  ratio = "16/10",
  className,
  style,
  children,
}: PhImgProps) {
  return (
    <div
      className={cn("ph-img w-full", className)}
      style={{ aspectRatio: ratio, ...style }}
    >
      <span>{label}</span>
      {children}
    </div>
  );
}
