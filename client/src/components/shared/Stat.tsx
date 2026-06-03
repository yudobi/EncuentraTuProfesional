interface StatProps {
  n: string;
  label: string;
  dark?: boolean;
}

export function Stat({ n, label, dark = false }: StatProps) {
  return (
    <div>
      <div
        className="h-display text-[44px] md:text-[64px] leading-[0.9]"
        style={{ color: dark ? "var(--color-paper)" : "var(--color-ink)" }}
      >
        {n}
      </div>
      <div
        className="mono text-[10px] md:text-xs mt-2.5 uppercase tracking-[0.08em]"
        style={{ color: dark ? "var(--color-mute-2)" : "var(--color-mute)" }}
      >
        {label}
      </div>
    </div>
  );
}
