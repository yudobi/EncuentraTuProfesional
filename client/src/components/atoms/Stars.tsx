interface StarsProps {
  value?: number;
  size?: number;
}

export function Stars({ value = 5, size = 14 }: StarsProps) {
  const rounded = Math.round(value);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.4}
            className={filled ? "" : "off"}
          >
            <path d="M8 1.5l1.95 4.06 4.45.65-3.22 3.14.76 4.43L8 11.7l-3.94 2.08.76-4.43L1.6 6.21l4.45-.65L8 1.5z" />
          </svg>
        );
      })}
    </span>
  );
}
