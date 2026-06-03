import type { CategoryIconName } from "@/types";

interface CatIconProps {
  name: CategoryIconName;
  size?: number;
  className?: string;
}

export function CatIcon({ name, size = 22, className }: CatIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "wrench":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a4 4 0 0 1 5 5l-2-1-2 2 1 2a4 4 0 0 1-5-5" />
          <path d="M11.7 11.7l-7 7a2 2 0 1 1-2.8-2.8l7-7" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...props}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case "broom":
      return (
        <svg {...props}>
          <path d="M14 4l6 6" />
          <path d="M9 9l6 6-3 3a4 4 0 0 1-6-6z" />
          <path d="M3 21l4-4" />
        </svg>
      );
    case "brush":
      return (
        <svg {...props}>
          <path d="M14 3l7 7-9 9-7-7z" />
          <path d="M5 17a3 3 0 0 0-3 3l3-1z" />
        </svg>
      );
    case "hammer":
      return (
        <svg {...props}>
          <path d="M15 2l7 7-3 3-7-7z" />
          <path d="M11 8l-9 9 4 4 9-9" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...props}>
          <path d="M3 21c0-9 7-16 18-18-1 11-9 18-18 18z" />
          <path d="M3 21l9-9" />
        </svg>
      );
    case "truck":
      return (
        <svg {...props}>
          <rect x="2" y="6" width="11" height="10" />
          <path d="M13 9h4l4 4v3h-8z" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    case "snow":
      return (
        <svg {...props}>
          <path d="M12 2v20M4 6l16 12M4 18L20 6" />
        </svg>
      );
    case "key":
      return (
        <svg {...props}>
          <circle cx="8" cy="14" r="4" />
          <path d="M11 12l10-10M17 6l3 3M14 9l3 3" />
        </svg>
      );
    case "chip":
      return (
        <svg {...props}>
          <rect x="6" y="6" width="12" height="12" rx="1" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </svg>
      );
    case "scissors":
      return (
        <svg {...props}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M8.5 8.5L20 20M8.5 15.5L20 4" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" />
          <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
        </svg>
      );
    default:
      return null;
  }
}
