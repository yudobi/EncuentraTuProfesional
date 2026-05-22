import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Stars } from "@/components/atoms/Stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Step = "service" | "platform";

export default function Review() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderCode, setOrderCode] = useState(orderId || "LS-2A98F1");
  const [verified, setVerified] = useState(true);
  const [serviceRating, setServiceRating] = useState(0);
  const [platformRating, setPlatformRating] = useState(0);
  const [step, setStep] = useState<Step>("service");
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-110px)] p-10 fade-up">
        <div className="max-w-[540px] text-center">
          <div className="w-20 h-20 mx-auto bg-[var(--color-signal)] border-2 border-[var(--color-ink)] rounded-full flex items-center justify-center">
            <Check className="h-9 w-9" />
          </div>
          <h1 className="h-display text-[36px] md:text-[56px] mt-6">
            ¡Gracias por tu reseña!
          </h1>
          <p className="text-mute mt-2.5">
            Tu opinión ayuda a otros clientes y al profesional. El admin la revisará en
            las próximas horas.
          </p>
          <Button variant="primary" className="mt-6" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-paper-2)] min-h-[calc(100vh-110px)] py-10 px-5 md:px-10 fade-up">
      <div className="max-w-[720px] mx-auto">
        <Eyebrow>Dejar reseña</Eyebrow>
        <h1 className="h-display text-[36px] md:text-[56px] mt-3 mb-8">
          Cuéntanos cómo fue.
        </h1>

        <div className="flex items-center gap-2 mb-6">
          <StepDot n={1} active={step === "service"} done={step === "platform"} label="Servicio" />
          <div className="flex-1 h-px bg-[var(--color-line)]" />
          <StepDot n={2} active={step === "platform"} label="Plataforma" />
        </div>

        {/* Verificación */}
        <div className="ls-card p-6 md:p-7 mb-3.5">
          <Eyebrow>Verificación</Eyebrow>
          <Field label="Número de orden" className="mt-3">
            <div className="flex gap-2.5">
              <Input
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="font-mono"
              />
              <Button variant="ghost" onClick={() => setVerified(true)}>
                Verificar
              </Button>
            </div>
          </Field>
          {verified && (
            <div
              className="flex items-center gap-2 mt-3 p-3 rounded text-[13px]"
              style={{
                background: "var(--color-good-bg)",
                color: "var(--color-good)",
              }}
            >
              <Check className="h-4 w-4" /> Orden verificada · Servicio:{" "}
              <b>Diagnóstico de fuga</b> con <b>Marcos Rivera</b> · Hoy 17:30
            </div>
          )}
          <div className="text-mute text-xs mt-2.5">
            Solo puedes reseñar servicios completados con orden válida. Una reseña por
            orden.
          </div>
        </div>

        {step === "service" && verified && (
          <div className="ls-card p-6 md:p-7">
            <Eyebrow>1 / 2 — Sobre el servicio</Eyebrow>
            <div className="mt-4">
              <div className="text-base font-semibold mb-2">¿Qué tal estuvo Marcos?</div>
              <BigStars value={serviceRating} onChange={setServiceRating} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
              {["Puntualidad", "Limpieza", "Comunicación", "Calidad"].map((d) => (
                <div
                  key={d}
                  className="p-3.5 border border-[var(--color-line)] rounded-md"
                >
                  <div className="text-xs text-mute">{d}</div>
                  <div className="mt-1">
                    <Stars value={5} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Field label="Tu reseña">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  placeholder="Cuéntanos cómo fue tu experiencia..."
                  maxLength={500}
                />
              </Field>
              <div className="text-mute text-xs mt-1">
                {text.length} / 500 caracteres
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {["Volvería a contratar", "Recomendaría", "Excelente precio"].map((t) => (
                <button
                  key={t}
                  className="inline-flex px-3 py-1.5 border border-[var(--color-line)] rounded-full text-xs hover:border-[var(--color-ink)] cursor-pointer transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-7 flex-wrap gap-3">
              <Button variant="link" className="text-xs">
                Cancelar
              </Button>
              <Button
                variant="signal"
                disabled={serviceRating === 0}
                onClick={() => setStep("platform")}
                className="hover-signal"
              >
                Siguiente: plataforma <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {step === "platform" && (
          <div className="ls-card p-6 md:p-7">
            <Eyebrow>2 / 2 — Sobre LinkService</Eyebrow>
            <p className="text-mute mt-2 text-sm">
              Esta valoración es opcional pero nos ayuda mucho. Solo usuarios
              registrados pueden dejarla.
            </p>
            <div className="mt-4">
              <div className="text-base font-semibold mb-2">
                ¿Cómo fue tu experiencia con la plataforma?
              </div>
              <BigStars value={platformRating} onChange={setPlatformRating} />
            </div>

            <div className="mt-6">
              <Field label="Comentario sobre la plataforma">
                <Textarea rows={4} placeholder="¿Qué mejorarías? ¿Qué te gustó?" />
              </Field>
            </div>

            <div className="flex items-center justify-between mt-7 flex-wrap gap-3">
              <Button variant="link" className="text-xs" onClick={() => setStep("service")}>
                ← Volver
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setDone(true)}>
                  Saltar y publicar
                </Button>
                <Button variant="signal" onClick={() => setDone(true)} className="hover-signal">
                  Publicar reseña
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepDot({
  n,
  active,
  done,
  label,
}: {
  n: number;
  active?: boolean;
  done?: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center mono text-xs border border-[var(--color-ink)]"
        style={{
          background: active
            ? "var(--color-ink)"
            : done
              ? "var(--color-signal)"
              : "var(--color-paper)",
          color: active ? "var(--color-paper)" : "var(--color-ink)",
        }}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : n}
      </div>
      <span
        className={cn(
          "text-[13px]",
          active || done ? "text-[var(--color-ink)]" : "text-mute",
          active && "font-semibold",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function BigStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="bg-transparent border-0 cursor-pointer p-0"
          type="button"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill={i <= value ? "var(--color-signal)" : "none"}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          >
            <path d="M12 2l3 7 7 .5-5 5 1.5 7L12 18l-6.5 3.5L7 14.5l-5-5L9 9z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="mono ml-3 text-lg font-semibold">{value}/5</span>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="mono text-xs text-mute tracking-[0.04em] uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
