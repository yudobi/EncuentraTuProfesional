import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Star,
} from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { PhImg } from "@/components/atoms/PhImg";
import { Button } from "@/components/ui/button";
import { CatIcon } from "@/components/shared/CatIcon";
import { ProCard } from "@/components/shared/ProCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useProfessionals } from "@/hooks/useProfessionals";
import { cn } from "@/lib/utils";
import type { Professional } from "@/types";

type Sort = "rating" | "price-asc" | "distance";

export default function Results() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("categoria") || "all";
  const initialQuery = searchParams.get("q") || "";

  const { data: categories = [] } = useCategories();
  const [filterCat, setFilterCat] = useState(initialCat);
  const [sortBy, setSortBy] = useState<Sort>("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: pros = [] } = useProfessionals({
    categoryId: filterCat === "all" ? undefined : filterCat,
    query: initialQuery || undefined,
    sort: sortBy,
    verifiedOnly,
  });

  const activeCat = categories.find((c) => c.id === filterCat);

  const Filters = (
    <div className="flex flex-col">
      <Eyebrow>Filtros</Eyebrow>
      <FilterBlock title="Precio por hora">
        <div className="flex items-center gap-2">
          <input
            defaultValue="€10"
            className="w-full px-3 py-2 border border-[var(--color-line)] rounded-[var(--radius-sm)] text-[13px]"
          />
          <input
            defaultValue="€80"
            className="w-full px-3 py-2 border border-[var(--color-line)] rounded-[var(--radius-sm)] text-[13px]"
          />
        </div>
        <div className="h-1 bg-[var(--color-paper-2)] mt-3 relative rounded-full">
          <div className="absolute left-[12%] right-[30%] h-full bg-[var(--color-ink)] rounded-full" />
        </div>
      </FilterBlock>

      <FilterBlock title="Distancia">
        {["< 1 km", "< 5 km", "< 10 km", "Cualquier zona"].map((d, i) => (
          <label key={d} className="flex items-center gap-2 py-1.5 text-sm cursor-pointer">
            <input type="radio" name="dist" defaultChecked={i === 1} className="accent-[var(--color-ink)]" /> {d}
          </label>
        ))}
      </FilterBlock>

      <FilterBlock title="Valoración mínima">
        <div className="flex flex-wrap gap-1.5">
          {[3, 4, 4.5, 4.8].map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-line)] rounded-full text-xs cursor-pointer hover:border-[var(--color-ink)] transition-colors"
            >
              <Star className="h-3 w-3" /> {v}+
            </span>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Filtros rápidos">
        <ToggleRow label="Solo verificados" value={verifiedOnly} onChange={setVerifiedOnly} />
        <ToggleRow label="Disponible hoy" />
        <ToggleRow label="Acepta WhatsApp" />
        <ToggleRow label="Top Pro" />
      </FilterBlock>

      <Button variant="primary" className="w-full justify-center mt-4 h-11">
        Aplicar filtros
      </Button>
      <Button variant="link" className="w-full justify-center mt-2 text-[13px]">
        Limpiar todo
      </Button>
    </div>
  );

  return (
    <div className="fade-up">
      {/* Header */}
      <section className="border-b border-[var(--color-line)] pt-7 md:pt-8">
        <div className="ls-container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-mute mb-3">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <Link to="/categorias">Categorías</Link>
            {activeCat && (
              <>
                <span>/</span>
                <span className="text-[var(--color-ink)]">{activeCat.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="h-display text-[36px] md:text-[56px]">
              {activeCat ? activeCat.name : "Todos los servicios"}
              <span className="text-mute text-base md:text-lg mono ml-3 md:ml-4">
                {pros.length} resultados
              </span>
            </h1>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-[var(--color-line)] rounded-full p-1">
                <button
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[13px] transition-colors",
                    view === "grid"
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "text-[var(--color-ink)]",
                  )}
                  onClick={() => setView("grid")}
                >
                  Grid
                </button>
                <button
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[13px] transition-colors",
                    view === "list"
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "text-[var(--color-ink)]",
                  )}
                  onClick={() => setView("list")}
                >
                  Lista
                </button>
                <button className="px-3 py-1.5 rounded-full text-[13px]">Mapa</button>
              </div>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as Sort)}>
                <SelectTrigger className="w-[180px] h-9 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                  <SelectItem value="price-asc">Precio asc.</SelectItem>
                  <SelectItem value="distance">Más cercanos</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile filters trigger */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden h-9">
                    <Filter className="h-3.5 w-3.5" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh]">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-5">{Filters}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Category chips */}
          <div className="scroll-x mt-5 pb-5 -mx-5 px-5 md:-mx-0 md:px-0">
            <div className="flex items-center gap-2 flex-nowrap w-max">
              <Chip
                active={filterCat === "all"}
                onClick={() => setFilterCat("all")}
              >
                Todas
              </Chip>
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  active={filterCat === c.id}
                  onClick={() => setFilterCat(c.id)}
                >
                  <CatIcon name={c.icon} size={14} /> {c.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ls-section">
        <div className="ls-container">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="ls-card p-6 sticky top-24">{Filters}</div>
            </aside>

            <div>
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {pros.map((p) => (
                    <ProCard key={p.id} pro={p} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pros.map((p) => (
                    <ProRow key={p.id} pro={p} />
                  ))}
                </div>
              )}
              {pros.length === 0 && (
                <div className="ls-card flex flex-col items-center justify-center gap-2 py-16">
                  <div className="h-display text-[28px]">Sin resultados</div>
                  <div className="text-mute">Intenta otra categoría o quita filtros</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 border rounded-full text-xs whitespace-nowrap transition-all cursor-pointer",
        active
          ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
          : "bg-[var(--color-paper)] border-[var(--color-line)] hover:border-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[var(--color-line)] pt-4 mt-4 first:border-t-0 first:pt-3 first:mt-3">
      <div className="font-semibold mb-3 text-[13px]">{title}</div>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  value: controlled,
  onChange: setControlled,
}: {
  label: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [local, setLocal] = useState(false);
  const value = controlled ?? local;
  const set = setControlled ?? setLocal;
  return (
    <div
      className="flex items-center justify-between py-1.5 text-sm cursor-pointer"
      onClick={() => set(!value)}
    >
      <span>{label}</span>
      <div
        className={cn(
          "w-8 h-[18px] rounded-full relative transition-colors",
          value ? "bg-[var(--color-ink)]" : "bg-[var(--color-paper-3)]",
        )}
      >
        <div
          className={cn(
            "absolute top-[2px] w-[14px] h-[14px] rounded-full transition-all",
            value
              ? "left-4 bg-[var(--color-signal)]"
              : "left-[2px] bg-[var(--color-paper)]",
          )}
        />
      </div>
    </div>
  );
}

function ProRow({ pro }: { pro: Professional }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/pro/${pro.id}`)}
      className="ls-card p-4 grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-5 items-center cursor-pointer hover:shadow-[6px_6px_0_var(--color-ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
    >
      <PhImg label="foto" ratio="1/1" />
      <div className="min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <div className="font-semibold text-[15px] md:text-base">{pro.name}</div>
          {pro.verified && <Badge kind="verified">verificado</Badge>}
          {pro.badges.includes("Top Pro") && <Badge kind="signal">top pro</Badge>}
        </div>
        <div className="text-mute text-[13px] mb-2">{pro.title}</div>
        <div className="flex items-center flex-wrap text-mute text-xs gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {pro.location} · {pro.distanceKm} km
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{pro.responseMin} min
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {pro.jobsDone} trabajos
          </span>
        </div>
      </div>
      <div className="hidden md:block text-right">
        <div className="flex items-center justify-end gap-1 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="mono font-semibold">{pro.rating.toFixed(2)}</span>
          <span className="text-mute text-xs">({pro.reviewCount})</span>
        </div>
        <div className="font-semibold text-lg">
          desde €{pro.priceFrom}
          <span className="text-mute text-xs font-normal">/h</span>
        </div>
        <Button variant="signal" size="sm" className="mt-2.5 hover-signal">
          Ver perfil
        </Button>
      </div>
    </article>
  );
}
