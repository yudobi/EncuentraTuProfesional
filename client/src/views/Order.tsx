import { useNavigate, useParams } from "react-router";
import { Check } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Pill } from "@/components/atoms/Pill";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/hooks/useOrders";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Cita confirmada",
  completed: "Servicio completado",
  cancelled: "Orden cancelada",
  no_show: "No asistió",
};

function formatSchedule(iso: string | null): { value: string; sub?: string } {
  if (!iso) return { value: "Por coordinar" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { value: "Por coordinar" };
  const value = d.toLocaleString("es-ES", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const sub = d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return { value: value.charAt(0).toUpperCase() + value.slice(1), sub };
}

export default function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrder(id);

  if (!id || isError) {
    return (
      <div className="fade-up flex items-center justify-center min-h-[calc(100vh-110px)] py-10 px-5">
        <div className="ls-card max-w-[480px] w-full flex flex-col items-center gap-3 py-16 text-center">
          <div className="h-display text-[28px]">Orden no encontrada</div>
          <div className="text-mute">
            No pudimos encontrar la orden{id ? ` #${id}` : ""}. Verifica el número o
            inicia sesión.
          </div>
          <Button variant="primary" className="mt-2" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div className="fade-up flex items-center justify-center min-h-[calc(100vh-110px)] py-10 px-5">
        <div className="text-mute mono text-sm">Cargando orden…</div>
      </div>
    );
  }

  const schedule = formatSchedule(order.scheduled_for);

  return (
    <div className="fade-up flex items-center justify-center min-h-[calc(100vh-110px)] py-10 px-5 md:px-10">
      <div className="max-w-[720px] w-full">
        <div className="flex flex-col items-center gap-3.5 mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-signal)] border-2 border-[var(--color-ink)] flex items-center justify-center">
            <Check className="h-9 w-9" />
          </div>
          <Eyebrow>{STATUS_LABEL[order.status] ?? "Tu orden"}</Eyebrow>
          <h1 className="h-display text-[36px] md:text-[56px]">
            Tu orden <i>está en marcha</i>.
          </h1>
        </div>

        <div
          className="ls-card overflow-hidden border-[var(--color-ink)]"
          style={{ boxShadow: "8px 8px 0 var(--color-ink)" }}
        >
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-6 md:px-7 py-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="mono text-xs text-mute-2 tracking-[0.1em]">
                  NÚMERO DE ORDEN
                </div>
                <div className="h-display text-[36px] md:text-[42px] mt-1 text-[var(--color-signal)]">
                  {order.order_number}
                </div>
              </div>
              <Pill signal>guardar</Pill>
            </div>
            <div className="text-mute-2 text-xs mt-2 leading-relaxed">
              Conserva este número. Lo necesitarás para dejar tu reseña al finalizar el
              servicio.
            </div>
          </div>

          <div className="p-6 md:p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Detail
                label="Profesional"
                value={order.professional.name}
                sub={order.professional.title}
              />
              <Detail
                label="Servicio"
                value={order.service_title}
                sub={order.category ?? undefined}
              />
              <Detail label="Fecha" value={schedule.value} sub={schedule.sub} />
              <Detail label="Lugar" value={order.location || "Por coordinar"} />
              <Detail
                label="Precio acordado"
                value={order.agreed_price ? `€${order.agreed_price}` : "Por acordar"}
                sub="Pago tras servicio"
              />
              <Detail
                label="Contacto"
                value={
                  order.professional.contact.whatsapp
                    ? "WhatsApp habilitado"
                    : "Solo chat plataforma"
                }
              />
            </div>
          </div>

          <div className="bg-[var(--color-paper-2)] px-6 md:px-7 py-5 border-t border-[var(--color-line)]">
            <div className="mono text-xs text-mute">SIGUIENTES PASOS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <NextStep n="01" t="Recordatorio" d="Te avisamos 1h antes de la cita" />
              <NextStep n="02" t="Servicio" d="El pro completará el trabajo en sitio" />
              <NextStep
                n="03"
                t="Reseña"
                d={`Podrás reseñar con el código #${order.order_number}`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mt-7 gap-2.5 justify-center">
          <Button variant="primary" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
          {order.is_reviewable && (
            <Button
              variant="signal"
              className="hover-signal"
              onClick={() => navigate(`/review/${order.order_number}`)}
            >
              Dejar reseña
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => navigate(`/chat/${order.professional.id}`)}
          >
            Volver al chat
          </Button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="mono text-xs text-mute tracking-[0.06em] uppercase mb-1.5">
        {label}
      </div>
      <div className="font-semibold text-base">{value}</div>
      {sub && <div className="text-mute text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function NextStep({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div>
      <div className="mono text-xs text-mute">{n}</div>
      <div className="font-semibold mt-1 text-sm">{t}</div>
      <div className="text-mute text-xs mt-1 leading-relaxed">{d}</div>
    </div>
  );
}
