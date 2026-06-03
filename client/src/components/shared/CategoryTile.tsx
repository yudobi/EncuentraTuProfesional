import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { Category } from "@/types";
import { CatIcon } from "./CatIcon";
import { formatNumber } from "@/lib/utils";

interface CategoryTileProps {
  cat: Category;
  hot?: boolean;
}

export function CategoryTile({ cat, hot = false }: CategoryTileProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/resultados?categoria=${cat.id}`)}
      className={[
        "group p-6 md:p-7 cursor-pointer transition-colors min-h-[180px] md:min-h-[200px] flex flex-col justify-between text-left w-full",
        hot
          ? "bg-[var(--color-signal)] hover:bg-[var(--color-signal-2)]"
          : "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <CatIcon name={cat.icon} size={28} />
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div>
        <div className="h-display text-[28px] md:text-[32px] leading-none mb-1.5">
          {cat.name}
        </div>
        <div className="text-mute text-xs mb-1.5">{cat.hero}</div>
        <div className="mono text-xs">{formatNumber(cat.count)} profesionales</div>
      </div>
    </button>
  );
}
