import { type ReactNode } from "react";
import { Plus } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { Pill } from "@/components/atoms/Pill";
import { Stars } from "@/components/atoms/Stars";
import { Avatar } from "@/components/atoms/Avatar";
import { PhImg } from "@/components/atoms/PhImg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROFESSIONALS, REVIEWS } from "@/data/mocks";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

export default function ProDashboard() {
  const pro = PROFESSIONALS[0];
  const reviews = REVIEWS.filter((r) => r.proId === pro.id && !r.flagged);

  return (
    <div className="px-5 md:px-10 py-8 fade-up min-w-0">
      <Tabs defaultValue="overview">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div>
            <Eyebrow>Esta semana</Eyebrow>
            <h1 className="h-display text-[36px] md:text-[56px] mt-2">Hola, Marcos.</h1>
          </div>
          <Button variant="signal" className="hover-signal self-start md:self-auto">
            <Plus className="h-3.5 w-3.5" /> Bloquear disponibilidad
          </Button>
        </div>

        <TabsList className="overflow-x-auto scroll-x mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="profile">Mi perfil</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          <TabsTrigger value="earnings">Ingresos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <KPI n="€1.840" l="Ingresos semana" delta="+12%" up />
            <KPI n="14" l="Servicios" delta="+3" up />
            <KPI n="4.92" l="Valoración" delta="+0.04" up />
            <KPI n="~12m" l="Respuesta" delta="-3m" up />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div className="ls-card p-5 md:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <Eyebrow>Próximas citas</Eyebrow>
                  <div className="h-display text-2xl mt-1.5">4 esta semana</div>
                </div>
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </div>
              <div className="mt-4">
                {[
                  {
                    d: "Hoy",
                    t: "17:30",
                    c: "Carla M.",
                    s: "Diagnóstico de fuga",
                    o: "LS-2A98F1",
                    urgent: true,
                  },
                  {
                    d: "Mañana",
                    t: "09:00",
                    c: "Iván R.",
                    s: "Reparación calentador",
                    o: "LS-2A99A2",
                  },
                  {
                    d: "Vie 6",
                    t: "11:00",
                    c: "Núria B.",
                    s: "Cambio sanitario",
                    o: "LS-2AA10F",
                  },
                  {
                    d: "Sáb 7",
                    t: "16:00",
                    c: "David T.",
                    s: "Revisión completa",
                    o: "LS-2AA32D",
                  },
                ].map((apt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 md:gap-4 py-3.5 border-b border-[var(--color-line)] last:border-b-0 flex-wrap"
                  >
                    <div className="min-w-[70px]">
                      <div
                        className="mono text-xs font-semibold"
                        style={{
                          color: apt.urgent
                            ? "var(--color-signal-deep)"
                            : "var(--color-mute)",
                        }}
                      >
                        {apt.d}
                      </div>
                      <div className="font-display text-lg">{apt.t}</div>
                    </div>
                    <Avatar initials={initials(apt.c)} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{apt.c}</div>
                      <div className="text-mute text-xs truncate">{apt.s}</div>
                    </div>
                    <Pill>#{apt.o}</Pill>
                    {apt.urgent && <Badge kind="signal">hoy</Badge>}
                  </div>
                ))}
              </div>
            </div>

            <div className="ls-card p-5 md:p-6">
              <Eyebrow>Reseñas sin responder</Eyebrow>
              <div className="flex flex-col gap-3.5 mt-4">
                {reviews.slice(0, 2).map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-[var(--color-paper-2)] rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <Stars value={r.rating} />
                      <span className="mono text-[10px] text-mute">
                        hace {r.daysAgo}d
                      </span>
                    </div>
                    <div className="text-xs mt-2 leading-relaxed">«{r.text}»</div>
                    <div className="text-mute text-xs mt-1.5">
                      {r.user} · #{r.orderId}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2.5 text-xs">
                      Responder
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <ProEdit />
        </TabsContent>

        <TabsContent value="requests">
          <Requests />
        </TabsContent>

        <TabsContent value="orders">
          <Orders />
        </TabsContent>

        <TabsContent value="reviews">
          <div className="flex flex-col gap-3.5">
            {reviews.map((r) => (
              <div key={r.id} className="ls-card p-5">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={r.initials} size={36} />
                    <div>
                      <div className="font-semibold text-sm">{r.user}</div>
                      <div className="text-mute text-xs">hace {r.daysAgo}d</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} />
                    <Pill>#{r.orderId}</Pill>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings">
          <Earnings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPI({
  n,
  l,
  delta,
  up,
}: {
  n: string;
  l: string;
  delta?: string;
  up?: boolean;
}) {
  return (
    <div className="ls-card p-4 md:p-5">
      <div className="mono text-[10px] md:text-xs text-mute uppercase">{l}</div>
      <div className="h-display text-[28px] md:text-[36px] mt-1.5">{n}</div>
      {delta && (
        <div
          className="flex items-center gap-1 text-xs mt-1"
          style={{ color: up ? "var(--color-good)" : "var(--color-bad)" }}
        >
          <span>{up ? "↑" : "↓"}</span> {delta}{" "}
          <span className="text-mute">vs sem. ant.</span>
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="mono text-xs text-mute tracking-[0.04em] uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

function ProEdit() {
  const pro = PROFESSIONALS[0];
  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="h-display text-[28px] md:text-[36px]">Mi perfil</h2>
        <Badge kind="alert">2 cambios en revisión</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ls-card p-5 md:p-6">
          <Eyebrow>Información pública</Eyebrow>
          <div className="flex flex-col gap-3.5 mt-4">
            <FieldRow label="Nombre">
              <Input defaultValue={pro.name} />
            </FieldRow>
            <FieldRow label="Título profesional">
              <Input defaultValue={pro.title} />
            </FieldRow>
            <FieldRow label="Bio">
              <Textarea defaultValue={pro.bio} rows={5} />
            </FieldRow>
            <FieldRow label="Precio desde">
              <Input defaultValue={`€${pro.priceFrom}/h`} />
            </FieldRow>
          </div>
        </div>
        <div className="ls-card p-5 md:p-6">
          <Eyebrow>Galería</Eyebrow>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {pro.gallery.map((g, i) => (
              <PhImg key={g} label={`#${i + 1}`} ratio="1/1" />
            ))}
            <div className="ph-img aspect-square cursor-pointer border-dashed">+ subir</div>
          </div>
          <div className="mt-5">
            <Eyebrow>Especialidades</Eyebrow>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {pro.skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--color-line)] rounded-full text-xs"
                >
                  {s}
                </span>
              ))}
              <span className="inline-flex px-3 py-1.5 border border-dashed border-[var(--color-line)] rounded-full text-xs cursor-pointer">
                + añadir
              </span>
            </div>
          </div>
          <div className="p-3 bg-[var(--color-paper-2)] rounded-md mt-5 text-[13px] leading-relaxed flex items-start gap-2">
            <span>🛡️</span> Tus cambios serán visibles tras la{" "}
            <b>aprobación del admin</b> (24h máx).
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2.5 mt-5 flex-wrap">
        <Button variant="ghost">Descartar</Button>
        <Button variant="signal" className="hover-signal">
          Enviar a revisión
        </Button>
      </div>
    </div>
  );
}

function Requests() {
  const reqs = [
    {
      c: "Carla M.",
      q: "Fuga en baño desde anoche, urgente",
      t: "hace 4 min",
      priv: false,
      urgent: true,
    },
    {
      c: "Iván R.",
      q: "Calentador no enciende, calle Goya 12",
      t: "hace 32 min",
      priv: false,
      urgent: false,
    },
    {
      c: "David T.",
      q: "Quiere ver datos de contacto (privado)",
      t: "hace 1h",
      priv: true,
      urgent: false,
    },
  ];
  return (
    <div>
      <h2 className="h-display text-[28px] md:text-[36px] mb-5">
        Solicitudes pendientes{" "}
        <span className="mono text-base text-mute">· {reqs.length}</span>
      </h2>
      <div className="flex flex-col gap-3">
        {reqs.map((r, i) => (
          <div
            key={i}
            className="ls-card p-4 md:p-5 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-3 md:gap-4 items-center"
          >
            <Avatar initials={initials(r.c)} size={42} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{r.c}</span>
                {r.urgent && <Badge kind="signal">urgente</Badge>}
                {r.priv && <Badge kind="ink">contacto privado</Badge>}
              </div>
              <div className="text-mute text-sm mt-1">{r.q}</div>
              <div className="mono text-xs text-mute mt-1">{r.t}</div>
            </div>
            <div className="col-span-2 md:col-span-1 flex gap-2 justify-end">
              {r.priv ? (
                <>
                  <Button variant="ghost" size="sm">
                    Ignorar
                  </Button>
                  <Button variant="signal" size="sm" className="hover-signal">
                    Confirmar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm">
                    Rechazar
                  </Button>
                  <Button variant="primary" size="sm">
                    Chat
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Orders() {
  const rows = [
    {
      o: "LS-2A98F1",
      c: "Carla M.",
      s: "Diagnóstico de fuga",
      d: "Hoy 17:30",
      st: "En curso",
      v: "€35",
      kind: "signal" as const,
    },
    {
      o: "LS-2A88D0",
      c: "Javier T.",
      s: "Urgencia domingo",
      d: "23 oct",
      st: "Cerrada",
      v: "€95",
      kind: "verified" as const,
    },
    {
      o: "LS-2A7012",
      c: "Núria B.",
      s: "Cambio sanitario",
      d: "06 oct",
      st: "Cerrada",
      v: "€140",
      kind: "verified" as const,
    },
    {
      o: "LS-2A5511",
      c: "Anónimo",
      s: "—",
      d: "29 sep",
      st: "Cancelada",
      v: "—",
      kind: "alert" as const,
    },
  ];
  return (
    <div>
      <h2 className="h-display text-[28px] md:text-[36px] mb-5">Órdenes</h2>
      <div className="ls-card overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
              {["Orden", "Cliente", "Servicio", "Fecha", "Estado", "Total"].map((h) => (
                <th
                  key={h}
                  className="text-left p-4 mono text-[11px] tracking-[0.06em] uppercase text-mute"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[var(--color-line)] last:border-b-0">
                <td className="p-4">
                  <Pill>#{r.o}</Pill>
                </td>
                <td className="p-4 font-semibold">{r.c}</td>
                <td className="p-4">{r.s}</td>
                <td className="p-4 text-mute">{r.d}</td>
                <td className="p-4">
                  <Badge kind={r.kind}>{r.st}</Badge>
                </td>
                <td className="p-4 font-semibold">{r.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Earnings() {
  const months = [40, 55, 38, 70, 65, 80, 50, 88, 75, 92, 68, 96];
  return (
    <div>
      <h2 className="h-display text-[28px] md:text-[36px] mb-5">Ingresos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
        <KPI n="€7.842" l="Mes en curso" delta="+18%" up />
        <KPI n="€68.130" l="Año 2026" delta="+24%" up />
        <KPI n="€122" l="Ticket medio" delta="+€8" up />
      </div>
      <div className="ls-card p-5 md:p-6">
        <Eyebrow>Últimos 12 meses</Eyebrow>
        <div className="flex items-end gap-1.5 h-[200px] mt-6">
          {months.map((h, i) => (
            <div
              key={i}
              className="flex-1 relative"
              style={{
                height: `${h}%`,
                background:
                  i === 11 ? "var(--color-signal)" : "var(--color-ink)",
                borderRadius: "2px 2px 0 0",
              }}
            >
              {i === 11 && (
                <div className="mono text-[10px] absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  €7.8k
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-2">
          {["D", "E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N"].map((m, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[11px] mono text-mute"
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
