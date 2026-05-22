import { Heart, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/atoms/Badge";
import { PhImg } from "@/components/atoms/PhImg";
import { Button } from "@/components/ui/button";
import type { Professional } from "@/types";

interface ProCardProps {
  pro: Professional;
}

export function ProCard({ pro }: ProCardProps) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/pro/${pro.id}`)}
      className="ls-card overflow-hidden cursor-pointer transition-all hover:shadow-[6px_6px_0_var(--color-ink)] hover:-translate-x-0.5 hover:-translate-y-0.5"
    >
      <div className="relative">
        <PhImg
          label={`portfolio · ${pro.name}`}
          ratio="4/3"
          className="rounded-none border-0 border-b border-[var(--color-line)]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {pro.badges.includes("Top Pro") && <Badge kind="signal">top pro</Badge>}
          {pro.verified && <Badge kind="verified">verificado</Badge>}
        </div>
        <Button
          variant="icon"
          size="icon-sm"
          className="absolute top-3 right-3 bg-white/85"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="font-semibold text-[15px]">{pro.name}</div>
          <div className="flex items-center gap-1 text-[13px]">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="mono">{pro.rating.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-mute text-xs mb-3">{pro.title}</div>
        <div className="flex items-center justify-between pt-3 border-t border-dashed border-[var(--color-line)]">
          <div className="text-mute text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {pro.location} · {pro.distanceKm} km
          </div>
          <div className="font-semibold">
            desde €{pro.priceFrom}
            <span className="text-mute text-xs font-normal">/h</span>
          </div>
        </div>
      </div>
    </article>
  );
}
