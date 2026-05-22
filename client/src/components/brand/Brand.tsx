import { Link } from "react-router";
import { LSLogo } from "./LSLogo";
import { cn } from "@/lib/utils";

interface BrandProps {
  size?: number;
  className?: string;
  mono?: boolean;
  withText?: boolean;
}

export function Brand({
  size = 28,
  className,
  mono = false,
  withText = true,
}: BrandProps) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 cursor-pointer select-none", className)}
    >
      <LSLogo size={size} mono={mono} />
      {withText && (
        <span
          className="font-display tracking-[-0.02em]"
          style={{ fontSize: Math.round(size * 0.85) }}
        >
          LinkService
        </span>
      )}
    </Link>
  );
}
