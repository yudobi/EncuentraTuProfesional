import { useNavigate, useParams } from "react-router";
import { Check } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Pill } from "@/components/atoms/Pill";
import { Button } from "@/components/ui/button";
import { PROFESSIONALS } from "@/data/mocks";

export default function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = id || "LS-2A98F1";
  const pro = PROFESSIONALS[0];

  return (
    <div className="fade-up flex items-center justify-center min-h-[calc(100vh-110px)] py-10 px-5 md:px-10">
      <div className="max-w-[720px] w-full">
        <div className="flex flex-col items-center gap-3.5 mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-signal)] border-2 border-[var(--color-ink)] flex items-center justify-center">
            <Check className="h-9 w-9" />
          </div>
          <Eyebrow>Cita confirmada</Eyebrow>
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
                  {orderId}
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
              <Detail label="Profesional" value={pro.name} sub={pro.title} />
              <Detail
                label="Servicio"
                value="Diagnóstico de fuga"
                sub="Plomería · 1h estimada"
              />
              <Detail label="Fecha" value="Hoy · 17:30" sub="3 nov. 2026" />
              <Detail label="Lugar" value="Calle Goya 34, 4º B" sub="Madrid · Centro" />
              <Detail label="Precio acordado" value="€35" sub="Pago tras servicio" />
              <Detail
                label="Contacto"
                value={pro.contact.whatsapp ? "WhatsApp habilitado" : "Solo chat plataforma"}
              />
            </div>
          </div>

          <div className="bg-[var(--color-paper-2)] px-6 md:px-7 py-5 border-t border-[var(--color-line)]">
            <div className="mono text-xs text-mute">SIGUIENTES PASOS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <NextStep n="01" t="Recordatorio" d="Te avisamos 1h antes de la cita" />
              <NextStep n="02" t="Servicio" d="El pro completará el trabajo en sitio" />
              <NextStep n="03" t="Reseña" d={`Recibirás un email con el código #${orderId}`} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mt-7 gap-2.5 justify-center">
          <Button variant="primary" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/chat/${pro.id}`)}>
            Volver al chat
          </Button>
          <Button variant="ghost">Descargar PDF</Button>
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
