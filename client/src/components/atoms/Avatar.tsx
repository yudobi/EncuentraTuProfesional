import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: number;
  signal?: boolean;
  className?: string;
}

export function Avatar({ initials, size = 40, signal = false, className }: AvatarProps) {
  const fontSize = Math.round(size * 0.42);
  return (
    <div
      className={cn("ph-avatar border border-[var(--color-line)]", className)}
      style={{
        width: size,
        height: size,
        fontSize,
        background: signal ? "var(--color-signal)" : "var(--color-paper-2)",
      }}
    >
      {initials}
    </div>
  );
}
