interface LSLogoProps {
  size?: number;
  mono?: boolean;
  className?: string;
}

export function LSLogo({ size = 28, mono = false, className }: LSLogoProps) {
  const ink = mono ? "currentColor" : "var(--color-ink)";
  const sig = mono ? "currentColor" : "var(--color-signal)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-label="LinkService"
      className={className}
    >
      <path
        d="M20 12 a8 8 0 1 0 0 16"
        stroke={ink}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path d="M14 14 v12" stroke={ink} strokeWidth="3.6" strokeLinecap="round" />
      <path
        d="M20 12 a8 8 0 1 1 0 16"
        stroke={sig}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path d="M26 14 v12" stroke={sig} strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}
