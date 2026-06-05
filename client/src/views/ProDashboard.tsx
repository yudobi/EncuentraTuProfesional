import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { Pill } from "@/components/atoms/Pill";
import { Stars } from "@/components/atoms/Stars";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMe } from "@/hooks/useAuth";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/useProfessionals";
import { useMyOrders } from "@/hooks/useOrders";
import { useReviewsByPro, useReplyReview } from "@/hooks/useReviews";
import { extractApiError } from "@/hooks/useAuth";
import type { Professional, Order, Review } from "@/types";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2);

const STATUS_BADGE: Record<string, "signal" | "verified" | "alert"> = {
  scheduled: "signal",
  completed: "verified",
  cancelled: "alert",
  no_show: "alert",
};
const STATUS_LABEL: Record<string, string> = {
  scheduled: "Agendada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

export default function ProDashboard() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: profile, isLoading, isError } = useMyProfile();
  const { data: orders = [] } = useMyOrders();
  const { data: reviews = [] } = useReviewsByPro(profile?.id);

  if (isLoading) {
    return <div className="p-10 text-mute mono text-sm">Cargando tu panel…</div>;
  }

  if (isError || !profile) {
    return (
      <div className="px-5 md:px-10 py-16 fade-up">
        <div className="ls-card max-w-[520px] mx-auto text-center py-14 px-6 flex flex-col items-center gap-3">
          <h1 className="h-display text-[28px]">Aún no tienes perfil profesional</h1>
          <p className="text-mute">
            Crea tu perfil para empezar a recibir solicitudes. Quedará pendiente de
            aprobación por el administrador.
          </p>
          <Button variant="signal" className="mt-2" onClick={() => navigate("/auth")}>
            Crear perfil profesional
          </Button>
        </div>
      </div>
    );
  }

  const completed = orders.filter((o) => o.status === "completed");
  const earnings = completed.reduce(
    (sum, o) => sum + (o.agreed_price ? Number(o.agreed_price) : 0),
    0,
  );
  const upcoming = orders.filter((o) => o.status === "scheduled");
  const unanswered = reviews.filter((r) => !r.proReply);

  return (
    <div className="px-5 md:px-10 py-8 fade-up min-w-0">
      <Tabs defaultValue="overview">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div>
            <Eyebrow>Tu panel</Eyebrow>
            <h1 className="h-display text-[36px] md:text-[56px] mt-2">
              Hola, {me?.first_name || profile.name}.
            </h1>
          </div>
          {!profile.verified && <Badge kind="alert">Perfil pendiente de aprobación</Badge>}
        </div>

        <TabsList className="overflow-x-auto scroll-x mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="profile">Mi perfil</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <KPI n={`€${earnings.toLocaleString("es-ES")}`} l="Ingresos (completadas)" />
            <KPI n={profile.jobsDone} l="Servicios" />
            <KPI n={profile.rating.toFixed(2)} l="Valoración" />
            <KPI n={`~${profile.responseMin}m`} l="Respuesta" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div className="ls-card p-5 md:p-6">
              <Eyebrow>Próximas citas</Eyebrow>
              <div className="h-display text-2xl mt-1.5">
                {upcoming.length} agendada{upcoming.length === 1 ? "" : "s"}
              </div>
              <div className="mt-4">
                {upcoming.length === 0 && (
                  <div className="text-mute text-sm py-4">No hay citas agendadas.</div>
                )}
                {upcoming.map((o) => (
                  <div
                    key={o.order_number}
                    className="flex items-center gap-3 md:gap-4 py-3.5 border-b border-[var(--color-line)] last:border-b-0 flex-wrap"
                  >
                    <Avatar initials={initials(o.client_name)} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{o.client_name}</div>
                      <div className="text-mute text-xs truncate">{o.service_title}</div>
                    </div>
                    <Pill>#{o.order_number}</Pill>
                  </div>
                ))}
              </div>
            </div>

            <div className="ls-card p-5 md:p-6">
              <Eyebrow>Reseñas sin responder</Eyebrow>
              <div className="flex flex-col gap-3.5 mt-4">
                {unanswered.length === 0 && (
                  <div className="text-mute text-sm py-4">Todas respondidas 🎉</div>
                )}
                {unanswered.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-3.5 bg-[var(--color-paper-2)] rounded-md">
                    <div className="flex items-center justify-between">
                      <Stars value={r.rating} />
                      <span className="mono text-[10px] text-mute">hace {r.daysAgo}d</span>
                    </div>
                    <div className="text-xs mt-2 leading-relaxed">«{r.text}»</div>
                    <div className="text-mute text-xs mt-1.5">
                      {r.user} · #{r.orderId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <ProEdit profile={profile} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTable orders={orders} />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsList reviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPI({ n, l }: { n: string | number; l: string }) {
  return (
    <div className="ls-card p-4 md:p-5">
      <div className="mono text-[10px] md:text-xs text-mute uppercase">{l}</div>
      <div className="h-display text-[28px] md:text-[36px] mt-1.5">{n}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="mono text-xs text-mute tracking-[0.04em] uppercase">{label}</label>
      {children}
    </div>
  );
}

function ProEdit({ profile }: { profile: Professional }) {
  const update = useUpdateMyProfile();
  const [headline, setHeadline] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [priceFrom, setPriceFrom] = useState(String(profile.priceFrom));
  const [location, setLocation] = useState(profile.location);

  useEffect(() => {
    setHeadline(profile.title);
    setBio(profile.bio);
    setPriceFrom(String(profile.priceFrom));
    setLocation(profile.location);
  }, [profile]);

  const save = () => {
    update.mutate(
      {
        headline,
        description: bio,
        price_from: priceFrom,
        location,
      },
      {
        onSuccess: () => toast.success("Cambios enviados a revisión del admin"),
        onError: (err) => toast.error(extractApiError(err)),
      },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="h-display text-[28px] md:text-[36px]">Mi perfil</h2>
        {profile.pendingEdits && <Badge kind="alert">cambios en revisión</Badge>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ls-card p-5 md:p-6">
          <Eyebrow>Información pública</Eyebrow>
          <div className="flex flex-col gap-3.5 mt-4">
            <FieldRow label="Nombre">
              <Input value={profile.name} disabled />
            </FieldRow>
            <FieldRow label="Título profesional">
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </FieldRow>
            <FieldRow label="Ubicación">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </FieldRow>
            <FieldRow label="Bio">
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} />
            </FieldRow>
            <FieldRow label="Precio desde (€/h)">
              <Input
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
              />
            </FieldRow>
          </div>
        </div>
        <div className="ls-card p-5 md:p-6">
          <Eyebrow>Especialidades</Eyebrow>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--color-line)] rounded-full text-xs"
              >
                {s}
              </span>
            ))}
            {profile.skills.length === 0 && (
              <span className="text-mute text-sm">Sin especialidades aún.</span>
            )}
          </div>
          <div className="p-3 bg-[var(--color-paper-2)] rounded-md mt-5 text-[13px] leading-relaxed flex items-start gap-2">
            <span>🛡️</span> Tus cambios serán visibles tras la{" "}
            <b>aprobación del admin</b>.
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2.5 mt-5 flex-wrap">
        <Button variant="signal" className="hover-signal" disabled={update.isPending} onClick={save}>
          {update.isPending ? "Enviando…" : "Enviar a revisión"}
        </Button>
      </div>
    </div>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div>
      <h2 className="h-display text-[28px] md:text-[36px] mb-5">Órdenes</h2>
      <div className="ls-card overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
              {["Orden", "Cliente", "Servicio", "Estado", "Total"].map((h) => (
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
            {orders.map((o) => (
              <tr key={o.order_number} className="border-b border-[var(--color-line)] last:border-b-0">
                <td className="p-4">
                  <Pill>#{o.order_number}</Pill>
                </td>
                <td className="p-4 font-semibold">{o.client_name}</td>
                <td className="p-4">{o.service_title}</td>
                <td className="p-4">
                  <Badge kind={STATUS_BADGE[o.status]}>{STATUS_LABEL[o.status]}</Badge>
                </td>
                <td className="p-4 font-semibold">
                  {o.agreed_price ? `€${o.agreed_price}` : "—"}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-mute">
                  Aún no tienes órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {reviews.length === 0 && (
        <div className="ls-card p-6 text-center text-mute">Aún no tienes reseñas.</div>
      )}
      {reviews.map((r) => (
        <ReviewItem key={r.id} r={r} />
      ))}
    </div>
  );
}

function ReviewItem({ r }: { r: Review }) {
  const reply = useReplyReview();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    reply.mutate(
      { id: r.id, text },
      {
        onSuccess: () => {
          toast.success("Respuesta publicada");
          setOpen(false);
          setText("");
        },
        onError: (err) => toast.error(extractApiError(err)),
      },
    );
  };

  return (
    <div className="ls-card p-5">
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

      {r.proReply ? (
        <div className="mt-3 p-3 bg-[var(--color-paper-2)] rounded-md text-sm">
          <div className="mono text-[10px] text-mute uppercase mb-1">Tu respuesta</div>
          {r.proReply}
        </div>
      ) : open ? (
        <div className="mt-3 flex flex-col gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Escribe tu respuesta…"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="signal"
              size="sm"
              className="hover-signal"
              disabled={reply.isPending}
              onClick={send}
            >
              Publicar
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" size="sm" className="mt-2.5 text-xs" onClick={() => setOpen(true)}>
          Responder
        </Button>
      )}
    </div>
  );
}
