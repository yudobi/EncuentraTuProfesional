import { AlertTriangle, Check, X } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { Pill } from "@/components/atoms/Pill";
import { Stars } from "@/components/atoms/Stars";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NOTIFICATIONS_ADMIN, REVIEWS } from "@/data/mocks";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

export default function Admin() {
  const notifications = NOTIFICATIONS_ADMIN;
  return (
    <div className="px-5 md:px-10 py-8 fade-up min-w-0">
      <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
        <div>
          <Eyebrow>
            <span className="text-[var(--color-signal)]">● ADMIN</span>
          </Eyebrow>
          <h1 className="h-display text-[36px] md:text-[56px] mt-2">
            Buenos días, Elena.
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Pill signal>
            {notifications.filter((n) => n.urgent).length} urgentes
          </Pill>
          <span className="mono text-xs text-mute">3 nov · 09:24</span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="overflow-x-auto scroll-x mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="validations">Validar perfiles</TabsTrigger>
          <TabsTrigger value="reviews">Moderar reviews</TabsTrigger>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <KPI n="4" l="Perfiles pendientes" delta="+2" />
            <KPI n="2" l="Reviews reportados" />
            <KPI n="148" l="Órdenes hoy" delta="+18%" up />
            <KPI n="3.4k" l="Pros activos" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="ls-card p-5 md:p-6">
              <div className="flex items-center justify-between">
                <Eyebrow>Cola de validación</Eyebrow>
                <Button variant="ghost" size="sm">
                  Ver todo
                </Button>
              </div>
              <div className="mt-4">
                {[
                  {
                    n: "Pablo Estévez",
                    c: "Cerrajería",
                    t: "Nuevo registro · DNI subido",
                    time: "hace 4 min",
                    urgent: true,
                  },
                  {
                    n: "Lucía Vega",
                    c: "Electricidad",
                    t: "Editó bio + precios",
                    time: "hace 22 min",
                    urgent: true,
                  },
                  {
                    n: "Marcos Yu",
                    c: "Carpintería",
                    t: "Nuevo registro · falta certificación",
                    time: "hace 1 h",
                    urgent: false,
                  },
                  {
                    n: "Inés Soler",
                    c: "Limpieza",
                    t: "Nuevo registro",
                    time: "hace 3 h",
                    urgent: false,
                  },
                ].map((p, i, arr) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3.5"
                    style={{
                      borderBottom:
                        i < arr.length - 1
                          ? "1px solid var(--color-line)"
                          : "0",
                    }}
                  >
                    <Avatar initials={initials(p.n)} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{p.n}</span>
                        <span className="text-mute text-xs">{p.c}</span>
                        {p.urgent && <Badge kind="alert">urgente</Badge>}
                      </div>
                      <div className="text-mute text-xs mt-0.5">
                        {p.t} · {p.time}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="icon" size="icon-sm">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon-sm"
                        className="bg-[var(--color-signal)] text-[var(--color-ink)] border border-[var(--color-ink)]"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ls-card p-5 md:p-6">
              <Eyebrow>Reviews reportados</Eyebrow>
              <div className="flex flex-col gap-3.5 mt-4">
                {REVIEWS.filter((r) => r.flagged).map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-[var(--color-paper-2)] rounded-md border-l-2 border-[var(--color-bad)]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Stars value={r.rating} />
                        <Pill>#{r.orderId}</Pill>
                      </div>
                      <Badge kind="alert">flag</Badge>
                    </div>
                    <div className="text-xs leading-relaxed mt-2">{r.text}</div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validations">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">
            Cola completa de validación
          </h2>
          <div className="ls-card overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
                  {["Pro", "Categoría", "Estado", "Tiempo", "Acción"].map((h) => (
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
                {["Pablo E.", "Lucía V.", "Marcos Y.", "Inés S."].map((n, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--color-line)] last:border-b-0"
                  >
                    <td className="p-4 font-semibold">{n}</td>
                    <td className="p-4 text-mute">Categoría {i + 1}</td>
                    <td className="p-4">
                      <Badge kind="alert">pendiente</Badge>
                    </td>
                    <td className="p-4 text-mute mono text-xs">
                      hace {i * 12 + 4} min
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                        <Button variant="signal" size="sm" className="hover-signal">
                          Aprobar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">
            Moderar reseñas
          </h2>
          <div className="flex flex-col gap-3.5">
            {REVIEWS.map((r) => (
              <div
                key={r.id}
                className="ls-card p-5 border-l-2"
                style={{
                  borderLeftColor: r.flagged
                    ? "var(--color-bad)"
                    : "var(--color-good)",
                }}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={r.initials} size={32} />
                    <div>
                      <div className="font-semibold text-sm">{r.user}</div>
                      <div className="text-mute text-xs">#{r.orderId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars value={r.rating} />
                    {r.flagged && (
                      <Badge kind="alert">
                        <AlertTriangle className="h-3 w-3" /> flag
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{r.text}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm">
                    Aprobar
                  </Button>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive">
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chats">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">
            Historial de chats
          </h2>
          <div className="ls-card p-6 text-center text-mute">
            Vista de auditoría de conversaciones. Disponible solo para incidentes y
            disputas registradas.
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">
            Notificaciones
          </h2>
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="ls-card p-4 flex items-start gap-3"
                style={{
                  borderLeftWidth: n.urgent ? 2 : 1,
                  borderLeftColor: n.urgent
                    ? "var(--color-signal-deep)"
                    : "var(--color-line)",
                }}
              >
                <div className="mono text-[10px] text-mute uppercase mt-1">
                  {n.type}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{n.text}</div>
                  <div className="text-mute text-xs mt-1">{n.time}</div>
                </div>
                {n.urgent && <Badge kind="alert">urgente</Badge>}
              </div>
            ))}
          </div>
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
          <span>{up ? "↑" : "↓"}</span> {delta}
        </div>
      )}
    </div>
  );
}
