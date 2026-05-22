import { useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, Shield } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { LSLogo } from "@/components/brand/LSLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/mocks";
import { cn } from "@/lib/utils";

type Mode = "user_login" | "user_signup" | "pro_login" | "pro_signup";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initial = (searchParams.get("mode") as Mode) || "user_login";
  const [mode, setMode] = useState<Mode>(initial);
  const navigate = useNavigate();

  const isPro = mode.startsWith("pro");
  const isSignup = mode.endsWith("signup");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)] bg-paper">
      {/* Form */}
      <div className="flex items-center justify-center py-10 px-5 md:p-10">
        <div className="max-w-[420px] w-full">
          {/* Switch cliente/pro */}
          <div className="inline-flex p-1 border border-[var(--color-line)] rounded-full mb-6">
            <button
              onClick={() => setMode(isSignup ? "user_signup" : "user_login")}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-colors cursor-pointer",
                !isPro
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "text-[var(--color-ink)]",
              )}
            >
              Cliente
            </button>
            <button
              onClick={() => setMode(isSignup ? "pro_signup" : "pro_login")}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-colors cursor-pointer",
                isPro
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "text-[var(--color-ink)]",
              )}
            >
              Profesional
            </button>
          </div>

          <Eyebrow>{isSignup ? "Crear cuenta" : "Iniciar sesión"}</Eyebrow>
          <h1 className="h-display text-[36px] md:text-[44px] mt-3 mb-2">
            {isSignup ? (isPro ? "Pon tu oficio " : "Únete a ") : "Bienvenido "}
            <i>{isSignup ? (isPro ? "en vitrina" : "LinkService") : "de nuevo"}</i>
          </h1>
          <p className="text-mute mt-2 text-sm">
            {isSignup
              ? isPro
                ? "Tu perfil será revisado por el admin antes de publicarse."
                : "Solo necesitas un email. Sin permanencia."
              : "Accede a tus chats, órdenes y reseñas."}
          </p>

          <form
            className="flex flex-col gap-3.5 mt-7"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(isPro && isSignup ? "/panel" : "/");
            }}
          >
            {isSignup && (
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Nombre">
                  <Input placeholder="María" />
                </Field>
                <Field label="Apellido">
                  <Input placeholder="López" />
                </Field>
              </div>
            )}
            <Field label="Email">
              <Input type="email" placeholder="hola@email.com" />
            </Field>
            <Field label="Contraseña">
              <Input type="password" placeholder="••••••••" />
            </Field>

            {isSignup && isPro && (
              <>
                <Field label="Categoría principal">
                  <select className="h-11 px-3.5 border border-[var(--color-line)] rounded-[var(--radius-sm)] bg-paper text-[15px] outline-none focus:border-[var(--color-ink)]">
                    {CATEGORIES.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Años de experiencia">
                  <Input type="number" placeholder="5" />
                </Field>
                <Field label="Zona de trabajo">
                  <Input placeholder="Madrid · 10 km" />
                </Field>
                <div className="flex items-start gap-2.5 p-3.5 bg-[var(--color-paper-2)] rounded-md">
                  <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold">Verificación obligatoria</div>
                    <div className="text-mute">
                      Te pediremos DNI y certificación al activar el perfil.
                    </div>
                  </div>
                </div>
              </>
            )}

            {isSignup && !isPro && (
              <Field label="Teléfono (opcional)">
                <Input placeholder="+34 ..." />
              </Field>
            )}

            <Button
              type="submit"
              variant="signal"
              className="w-full justify-center h-11 mt-2 hover-signal"
            >
              {isSignup ? "Crear cuenta" : "Entrar"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <div className="flex items-center gap-3.5 my-2">
              <div className="flex-1 h-px bg-[var(--color-line)]" />
              <span className="text-mute text-xs">o continúa con</span>
              <div className="flex-1 h-px bg-[var(--color-line)]" />
            </div>

            <div className="flex gap-2.5">
              <Button variant="ghost" type="button" className="flex-1 justify-center">
                Google
              </Button>
              <Button variant="ghost" type="button" className="flex-1 justify-center">
                Apple
              </Button>
            </div>

            <div className="text-mute text-xs text-center mt-2">
              {isSignup ? (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode(isPro ? "pro_login" : "user_login")}
                    className="text-[var(--color-ink)] font-semibold cursor-pointer underline"
                  >
                    Inicia sesión
                  </button>
                </>
              ) : (
                <>
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode(isPro ? "pro_signup" : "user_signup")}
                    className="text-[var(--color-ink)] font-semibold cursor-pointer underline"
                  >
                    Regístrate
                  </button>
                </>
              )}
            </div>

            {!isSignup && (
              <div className="text-mute text-xs text-center p-3.5 border border-dashed border-[var(--color-line)] rounded-md">
                Recuerda: <b>puedes navegar sin registrarte</b>, pero solo usuarios
                registrados pueden contratar y dejar reseñas.
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Visual */}
      <div
        className={cn(
          "p-10 lg:p-14 hidden lg:flex flex-col justify-between relative overflow-hidden",
          isPro
            ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
            : "bg-[var(--color-signal)] text-[var(--color-ink)]",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LSLogo size={28} mono={isPro} />
            <span className="font-display text-2xl">LinkService</span>
          </div>
          <span className="mono text-xs opacity-70">v1.0 / 2026</span>
        </div>

        <div>
          <h2 className="h-display text-[64px] xl:text-[88px] leading-[0.92]">
            {isPro ? (
              <>
                Reputación.
                <br />
                <i style={{ color: "var(--color-signal)" }}>Reservas.</i>
                <br />
                Ingresos.
              </>
            ) : (
              <>
                Encuentra.
                <br />
                <i>Conecta.</i>
                <br />
                Confía.
              </>
            )}
          </h2>
          <div
            className="grid grid-cols-2 gap-4 mt-14 pt-6 border-t"
            style={{
              borderColor: isPro ? "var(--color-ink-3)" : "var(--color-ink)",
            }}
          >
            <div>
              <div className="h-display text-[36px]">48k+</div>
              <div className="mono text-xs opacity-70">servicios completados</div>
            </div>
            <div>
              <div className="h-display text-[36px]">4.87★</div>
              <div className="mono text-xs opacity-70">valoración media</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="mono text-xs text-mute tracking-[0.04em] uppercase">{label}</label>
      {children}
    </div>
  );
}
