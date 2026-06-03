import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { CatIcon } from "@/components/shared/CatIcon";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types";
import { formatNumber } from "@/lib/utils";

export default function Categories() {
  const { data: cats = [] } = useCategories();
  return (
    <div className="fade-up">
      <section className="ls-section pb-8">
        <div className="ls-container">
          <Eyebrow>Catálogo completo</Eyebrow>
          <h1 className="h-display text-[56px] md:text-[88px] mt-4 max-w-[880px]">
            12 categorías. <i>Cientos de oficios.</i>
          </h1>
          <p className="text-mute text-base md:text-[17px] max-w-[560px] mt-4 leading-relaxed">
            Cada categoría agrupa especialidades verificadas. Filtra por tipo de
            servicio, urgencia y zona.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--color-line)]">
        <div className="ls-container px-0 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cats.map((c, i) => (
              <CatBigTile key={c.id} cat={c} idx={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CatBigTile({ cat, idx }: { cat: Category; idx: number }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const isHero = idx % 5 === 2;

  const bg = isHero
    ? "var(--color-signal)"
    : hover
      ? "var(--color-ink)"
      : "var(--color-paper)";
  const color = isHero
    ? "var(--color-ink)"
    : hover
      ? "var(--color-paper)"
      : "var(--color-ink)";

  return (
    <button
      type="button"
      onClick={() => navigate(`/resultados?categoria=${cat.id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-pointer px-7 py-9 md:px-9 md:py-11 min-h-[280px] md:min-h-[320px] border-r border-b border-[var(--color-line)] transition-all flex flex-col justify-between relative text-left w-full"
      style={{ background: bg, color }}
    >
      <div className="flex items-center justify-between">
        <div className="mono text-xs opacity-60">
          {String(idx + 1).padStart(2, "0")} / 12
        </div>
        <ArrowUpRight className="h-5 w-5" />
      </div>

      <div>
        <div className="mb-7">
          <CatIcon name={cat.icon} size={42} />
        </div>
        <div className="h-display text-[44px] md:text-[56px] leading-[0.95]">
          {cat.name}
        </div>
        <div className="mt-3.5 opacity-75 text-sm max-w-[280px] leading-relaxed">
          {cat.hero}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-current pt-4 mt-6 opacity-85">
        <span className="mono text-xs">{formatNumber(cat.count)} pros</span>
        <span className="mono text-xs">desde €{15 + idx * 3}/h</span>
      </div>
    </button>
  );
}
