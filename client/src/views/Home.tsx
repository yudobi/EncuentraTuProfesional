import { useNavigate } from "react-router";
import {
  ArrowRight,
  Bell,
  Check,
  Lock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Pill } from "@/components/atoms/Pill";
import { Badge } from "@/components/atoms/Badge";
import { Stars } from "@/components/atoms/Stars";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { CategoryTile } from "@/components/shared/CategoryTile";
import { ProCard } from "@/components/shared/ProCard";
import { Stat } from "@/components/shared/Stat";
import { TrustItem } from "@/components/shared/TrustItem";
import { useCategories } from "@/hooks/useCategories";
import { useProfessionals } from "@/hooks/useProfessionals";

const MARQUEE_ITEMS = [
  "PLOMERÍA",
  "ELECTRICIDAD",
  "LIMPIEZA",
  "PINTURA",
  "CARPINTERÍA",
  "JARDINERÍA",
  "MUDANZAS",
  "CLIMATIZACIÓN",
  "CERRAJERÍA",
  "TECNOLOGÍA",
  "BELLEZA",
  "TUTORÍAS",
];

export default function Home() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const { data: pros = [] } = useProfessionals();

  return (
    <div className="fade-up">
      {/* HERO EDITORIAL MARQUEE */}
      <HeroEditorial />

      {/* CATEGORÍAS */}
      <section className="ls-section pt-10 pb-6">
        <div className="ls-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <div>
              <Eyebrow>01 — Catálogo</Eyebrow>
              <h2 className="h-display text-[28px] md:text-[36px] mt-2.5">
                Servicios <i>para tu casa</i>,<br className="md:hidden" /> tu oficina, tu vida.
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/categorias")}
              className="self-start md:self-auto"
            >
              Ver las 12 categorías <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-lg overflow-hidden"
          >
            {categories.slice(0, 8).map((c, i) => (
              <CategoryTile key={c.id} cat={c} hot={i === 0 || i === 3} />
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section
        className="ls-section bg-[var(--color-paper-2)] py-14 md:py-[72px] mt-8"
      >
        <div className="ls-container">
          <Eyebrow>02 — Cómo funciona</Eyebrow>
          <div className="grid md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-8 md:gap-0 mt-6 items-start">
            <h2 className="h-display text-[36px] md:text-[56px] pr-0 md:pr-6">
              Tres pasos.<br />
              Cero <i>fricción</i>.
            </h2>
            <Step n="01" title="Busca o filtra" desc="Por categoría, distancia, valoración o disponibilidad inmediata. Filtros guardados." />
            <Step n="02" title="Conecta" desc="Chat directo en la plataforma o contacto privado por WhatsApp si el profesional lo permite." />
            <Step n="03" title="Confirma y valora" desc="Cada cita genera una orden única. Solo con orden válida puedes dejar reseña." />
          </div>
        </div>
      </section>

      {/* TOP PROS */}
      <section className="ls-section">
        <div className="ls-container">
          <div className="flex items-end justify-between mb-7">
            <div>
              <Eyebrow>03 — Top profesionales</Eyebrow>
              <h2 className="h-display text-[28px] md:text-[36px] mt-2.5">
                Verificados, valorados, <i>cerca de ti</i>.
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="icon" size="icon-sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="icon" size="icon-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-6">
            {pros.slice(0, 3).map((p) => (
              <ProCard key={p.id} pro={p} />
            ))}
          </div>
          {/* Mobile carousel */}
          <div className="md:hidden -mx-5 px-5 flex gap-4 scroll-x snap-x-mandatory">
            {pros.slice(0, 4).map((p) => (
              <div key={p.id} className="min-w-[78%] snap-start">
                <ProCard pro={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="ls-section bg-[var(--color-ink)] text-[var(--color-paper)] py-14 md:py-[72px]">
        <div className="ls-container">
          <div className="grid md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-8 items-end">
            <div>
              <Eyebrow>
                <span className="text-mute-2">04 — Confianza</span>
              </Eyebrow>
              <h2 className="h-display text-[36px] md:text-[56px] mt-2.5">
                Cada orden<br />
                está <i className="text-[var(--color-signal)]">respaldada</i>.
              </h2>
            </div>
            <Stat n="48,302" label="Servicios completados" dark />
            <Stat n="4.87" label="Valoración media (5)" dark />
            <Stat n="<14m" label="Respuesta media" dark />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 mt-12 md:mt-14 border-t border-[var(--color-ink-3)] pt-7">
            <TrustItem icon={Shield} title="Verificación de identidad" desc="DNI y certificaciones revisadas por el equipo admin." />
            <TrustItem icon={Lock} title="Chat protegido" desc="Conversaciones cifradas, datos personales nunca expuestos." />
            <TrustItem icon={Check} title="Órdenes únicas" desc="Cada cita genera un código irrepetible para reseñar." />
            <TrustItem icon={Bell} title="Soporte humano" desc="Moderación 7 días: cancelamos reviews fraudulentos." />
          </div>
        </div>
      </section>

      {/* CTA PRO */}
      <section className="bg-[var(--color-signal)] border-t border-b border-[var(--color-ink)] py-16 md:py-20 px-5 md:px-10">
        <div className="ls-container flex flex-col lg:flex-row gap-10 items-stretch">
          <div className="flex-1">
            <Eyebrow>Para profesionales</Eyebrow>
            <h2 className="h-display text-[56px] md:text-[88px] mt-2.5 mb-4 max-w-[720px]">
              Tu oficio, <i>en vitrina</i>.
            </h2>
            <p className="max-w-[540px] text-base md:text-lg leading-relaxed m-0">
              Publica tu perfil, recibe solicitudes de clientes verificados y construye reputación pública con cada orden cerrada. Sin comisiones por contacto privado.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/auth?mode=pro_signup")}
              >
                Crear perfil profesional <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border-[var(--color-ink)]"
                onClick={() => navigate("/panel")}
              >
                Ver demo del panel
              </Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[280px]">
            <ProTeaser />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroEditorial() {
  const navigate = useNavigate();
  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-paper)] overflow-hidden pt-12 md:pt-16">
      <div className="ls-container pb-10 md:pb-0">
        <Eyebrow>
          <span className="text-[var(--color-signal)] flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-signal)] dot-live" />
            en vivo
          </span>
        </Eyebrow>

        <h1 className="h-display text-[56px] sm:text-[80px] md:text-[110px] lg:text-[132px] leading-[0.9] mt-4 md:mt-6">
          Cualquier oficio,<br />
          <span className="text-[var(--color-signal)] italic">
            una sola plataforma.
          </span>
        </h1>

        <p className="text-mute-2 text-base md:text-lg max-w-[560px] mt-6 md:mt-8 leading-relaxed">
          Servicios para tu día a día,{" "}
          <span className="text-[var(--color-paper)]">conectados por persona</span>, no por
          algoritmo. Profesionales verificados, reputación pública, tú decides cómo
          contactar.
        </p>

        <div className="flex flex-wrap gap-3 mt-7 md:mt-8">
          <Button
            variant="signal"
            size="lg"
            onClick={() => navigate("/resultados")}
            className="hover-signal"
          >
            Buscar servicios <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost-dark"
            size="lg"
            onClick={() => navigate("/auth?mode=pro_signup")}
          >
            Soy profesional
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-8 text-xs md:text-sm text-mute-2">
          <span className="mono">● 3.4k pros conectados</span>
          <span className="hidden sm:inline w-px h-3 bg-[var(--color-ink-3)]" />
          <span className="mono">148 órdenes hoy</span>
          <span className="hidden sm:inline w-px h-3 bg-[var(--color-ink-3)]" />
          <span className="mono">respuesta &lt;14 min</span>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-12 md:mt-14 border-y border-[var(--color-ink-3)] py-4 md:py-5 overflow-hidden">
        <div className="flex whitespace-nowrap font-mono text-[16px] md:text-[22px] marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex shrink-0">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${dup}-${i}`} className="px-4 md:px-6">
                  {item} <span className="text-[var(--color-signal)]">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="border-l border-[var(--color-line)] pl-5 pr-5">
      <div className="mono text-xs text-mute mb-3.5">{n}</div>
      <div className="font-semibold text-lg mb-2">{title}</div>
      <div className="text-mute text-sm leading-relaxed">{desc}</div>
    </div>
  );
}

function ProTeaser() {
  return (
    <div className="relative h-full min-h-[280px]">
      <div
        className="ls-card absolute top-0 right-0 w-[260px] md:w-[280px] p-4"
        style={{
          transform: "rotate(2deg)",
          boxShadow: "6px 6px 0 var(--color-ink)",
          border: "1px solid var(--color-ink)",
        }}
      >
        <div className="flex items-center justify-between">
          <Eyebrow>esta semana</Eyebrow>
          <Pill>+12%</Pill>
        </div>
        <div className="h-display text-[44px] md:text-[48px] mt-2">€1.840</div>
        <div className="text-mute text-xs">14 servicios · 4 nuevos clientes</div>
        <div className="flex gap-1 mt-3.5 items-end h-[50px]">
          {[40, 60, 30, 80, 55, 95, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                height: `${h}%`,
                background: i === 5 ? "var(--color-ink)" : "var(--color-paper-3)",
              }}
            />
          ))}
        </div>
      </div>
      <div
        className="ls-card absolute bottom-6 left-6 w-[220px] md:w-[240px] p-4 bg-[var(--color-ink)] text-[var(--color-paper)]"
        style={{
          transform: "rotate(-3deg)",
          boxShadow: "-6px 6px 0 var(--color-paper)",
          border: "1px solid var(--color-ink)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-signal)] dot-live" />
          <span className="mono text-xs text-[var(--color-paper)]">NUEVA SOLICITUD</span>
        </div>
        <div className="mt-2.5 text-sm leading-relaxed">
          Carla M. quiere agendar una revisión para mañana 17:30.
        </div>
        <div className="flex gap-1.5 mt-3.5">
          <Button variant="signal" size="sm" className="hover-signal">
            Aceptar
          </Button>
          <Button variant="ghost-dark" size="sm">
            Más tarde
          </Button>
        </div>
      </div>
      {/* Small reviews chip showing reviewer */}
      <div
        className="ls-card hidden md:block absolute top-[44%] right-[44%] p-2.5 bg-[var(--color-paper)]"
        style={{
          transform: "rotate(-6deg)",
          border: "1px solid var(--color-line)",
        }}
      >
        <div className="flex items-center gap-2">
          <Avatar initials="JT" size={28} />
          <div className="flex flex-col">
            <Stars value={5} size={11} />
            <span className="mono text-[10px] text-mute">hace 2d</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3">
        <Badge kind="ink">prototipo</Badge>
      </div>
    </div>
  );
}
