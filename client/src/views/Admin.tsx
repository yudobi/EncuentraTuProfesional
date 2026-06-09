import { useSearchParams } from "react-router";
import { AlertTriangle, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { Pill } from "@/components/atoms/Pill";
import { Stars } from "@/components/atoms/Stars";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMe } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import {
  useAdminStats,
  usePendingProfessionals,
  useAdminReviews,
  useApproveProfessional,
  useRejectProfessional,
  useApproveReview,
  useDeleteReview,
  type AdminProfessional,
  type AdminReview,
} from "@/hooks/useAdmin";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

const TAB_FROM_QUERY: Record<string, string> = {
  notificaciones: "notifications",
  validar: "validations",
  reviews: "reviews",
};

export default function Admin() {
  const [searchParams] = useSearchParams();
  const initialTab = TAB_FROM_QUERY[searchParams.get("tab") ?? ""] ?? "overview";
  const { data: me } = useMe();
  const { data: stats } = useAdminStats();
  const { data: pending = [] } = usePendingProfessionals();
  const { data: reviews = [] } = useAdminReviews();
  const { data: notifications = [] } = useNotifications();
  const flaggedReviews = reviews.filter((r) => r.flagged);

  return (
    <div className="px-5 md:px-10 py-8 fade-up min-w-0">
      <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
        <div>
          <Eyebrow>
            <span className="text-[var(--color-signal)]">● ADMIN</span>
          </Eyebrow>
          <h1 className="h-display text-[36px] md:text-[56px] mt-2">
            Hola, {me?.first_name || "admin"}.
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Pill signal>{stats?.pending_professionals ?? 0} pendientes</Pill>
        </div>
      </div>

      <Tabs defaultValue={initialTab}>
        <TabsList className="overflow-x-auto scroll-x mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="validations">Validar perfiles</TabsTrigger>
          <TabsTrigger value="reviews">Moderar reviews</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <KPI n={stats?.pending_professionals ?? "—"} l="Perfiles pendientes" />
            <KPI n={stats?.flagged_reviews ?? "—"} l="Reviews reportados" />
            <KPI n={stats?.orders_today ?? "—"} l="Órdenes hoy" />
            <KPI n={stats?.active_professionals ?? "—"} l="Pros activos" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="ls-card p-5 md:p-6">
              <Eyebrow>Cola de validación</Eyebrow>
              <div className="mt-4">
                {pending.length === 0 && (
                  <div className="text-mute text-sm py-6 text-center">
                    No hay perfiles pendientes.
                  </div>
                )}
                {pending.map((p) => (
                  <ValidationRow key={p.id} p={p} />
                ))}
              </div>
            </div>

            <div className="ls-card p-5 md:p-6">
              <Eyebrow>Reviews reportados</Eyebrow>
              <div className="flex flex-col gap-3.5 mt-4">
                {flaggedReviews.length === 0 && (
                  <div className="text-mute text-sm py-4">Sin reseñas reportadas.</div>
                )}
                {flaggedReviews.map((r) => (
                  <FlaggedReviewCard key={r.id} r={r} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validations">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">
            Cola completa de validación
            <span className="mono text-base text-mute ml-3">· {pending.length}</span>
          </h2>
          <div className="ls-card overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
                  {["Pro", "Categoría", "Estado", "Email", "Acción"].map((h) => (
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
                {pending.map((p) => (
                  <ValidationTableRow key={p.id} p={p} />
                ))}
                {pending.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-mute">
                      No hay perfiles pendientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">Moderar reseñas</h2>
          <div className="flex flex-col gap-3.5">
            {reviews.length === 0 && (
              <div className="ls-card p-6 text-center text-mute">No hay reseñas.</div>
            )}
            {reviews.map((r) => (
              <ModerateReviewCard key={r.id} r={r} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <h2 className="h-display text-[28px] md:text-[36px] mb-5">Notificaciones</h2>
          <div className="flex flex-col gap-2">
            {notifications.length === 0 && (
              <div className="ls-card p-6 text-center text-mute">Sin notificaciones.</div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className="ls-card p-4 flex items-start gap-3"
                style={{
                  borderLeftWidth: n.urgent ? 2 : 1,
                  borderLeftColor: n.urgent
                    ? "var(--color-signal-deep)"
                    : "var(--color-line)",
                  opacity: n.is_read ? 0.6 : 1,
                }}
              >
                <div className="mono text-[10px] text-mute uppercase mt-1 min-w-[56px]">
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

function ValidationRow({ p }: { p: AdminProfessional }) {
  const approve = useApproveProfessional();
  const reject = useRejectProfessional();
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-[var(--color-line)] last:border-b-0">
      <Avatar initials={initials(p.name)} size={36} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{p.name}</span>
          <span className="text-mute text-xs">{p.category ?? "—"}</span>
          {p.approval_status === "changes_requested" && (
            <Badge kind="alert">cambios</Badge>
          )}
        </div>
        <div className="text-mute text-xs mt-0.5">{p.email}</div>
      </div>
      <div className="flex gap-1.5">
        <Button
          variant="icon"
          size="icon-sm"
          disabled={reject.isPending}
          onClick={() =>
            reject.mutate(
              { id: p.id },
              { onSuccess: () => toast.success(`${p.name} rechazado`) },
            )
          }
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon-sm"
          disabled={approve.isPending}
          className="bg-[var(--color-signal)] text-[var(--color-ink)] border border-[var(--color-ink)]"
          onClick={() =>
            approve.mutate(p.id, {
              onSuccess: () => toast.success(`${p.name} aprobado`),
            })
          }
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function ValidationTableRow({ p }: { p: AdminProfessional }) {
  const approve = useApproveProfessional();
  const reject = useRejectProfessional();
  return (
    <tr className="border-b border-[var(--color-line)] last:border-b-0">
      <td className="p-4 font-semibold">{p.name}</td>
      <td className="p-4 text-mute">{p.category ?? "—"}</td>
      <td className="p-4">
        <Badge kind="alert">{p.approval_status}</Badge>
      </td>
      <td className="p-4 text-mute text-xs">{p.email}</td>
      <td className="p-4">
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={reject.isPending}
            onClick={() => reject.mutate({ id: p.id })}
          >
            Rechazar
          </Button>
          <Button
            variant="signal"
            size="sm"
            className="hover-signal"
            disabled={approve.isPending}
            onClick={() =>
              approve.mutate(p.id, {
                onSuccess: () => toast.success(`${p.name} aprobado`),
              })
            }
          >
            Aprobar
          </Button>
        </div>
      </td>
    </tr>
  );
}

function FlaggedReviewCard({ r }: { r: AdminReview }) {
  const approve = useApproveReview();
  const del = useDeleteReview();
  return (
    <div className="p-3.5 bg-[var(--color-paper-2)] rounded-md border-l-2 border-[var(--color-bad)]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Stars value={r.rating} />
          <Pill>#{r.orderId}</Pill>
        </div>
        <Badge kind="alert">flag</Badge>
      </div>
      <div className="text-xs leading-relaxed mt-2">{r.text}</div>
      <div className="flex gap-2 mt-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          disabled={approve.isPending}
          onClick={() => approve.mutate(r.id, { onSuccess: () => toast.success("Reseña aprobada") })}
        >
          Aprobar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="text-xs"
          disabled={del.isPending}
          onClick={() => del.mutate(r.id, { onSuccess: () => toast.success("Reseña eliminada") })}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}

function ModerateReviewCard({ r }: { r: AdminReview }) {
  const approve = useApproveReview();
  const del = useDeleteReview();
  return (
    <div
      className="ls-card p-5 border-l-2"
      style={{ borderLeftColor: r.flagged ? "var(--color-bad)" : "var(--color-good)" }}
    >
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar initials={r.initials} size={32} />
          <div>
            <div className="font-semibold text-sm">{r.user}</div>
            <div className="text-mute text-xs">
              #{r.orderId} · {r.professional_name}
            </div>
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
        {r.flagged && (
          <Button
            variant="ghost"
            size="sm"
            disabled={approve.isPending}
            onClick={() => approve.mutate(r.id, { onSuccess: () => toast.success("Reseña aprobada") })}
          >
            Aprobar
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          disabled={del.isPending}
          onClick={() => del.mutate(r.id, { onSuccess: () => toast.success("Reseña eliminada") })}
        >
          Eliminar
        </Button>
      </div>
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
