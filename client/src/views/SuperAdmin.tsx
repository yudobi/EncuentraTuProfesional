import { Pencil, Plus, Trash2 } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { Pill } from "@/components/atoms/Pill";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, PROFESSIONALS, REVIEWS } from "@/data/mocks";
import { CatIcon } from "@/components/shared/CatIcon";
import { formatNumber } from "@/lib/utils";

export default function SuperAdmin() {
  return (
    <div className="px-5 md:px-10 py-8 fade-up min-w-0">
      <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
        <div>
          <Eyebrow>
            <span className="text-[var(--color-signal)]">● SUPER-ADMIN</span>
          </Eyebrow>
          <h1 className="h-display text-[36px] md:text-[56px] mt-2">
            Control total
          </h1>
        </div>
        <Pill signal>full crud</Pill>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList className="overflow-x-auto scroll-x mb-6">
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="pros">Profesionales</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          <CrudHeader title="Usuarios" subtitle="218,402 totales · 1,204 nuevos este mes" />
          <div className="ls-card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[var(--color-paper-2)] border-b border-[var(--color-line)]">
                  {["Usuario", "Email", "Estado", "Registro", "Órdenes", "Acción"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left p-4 mono text-[11px] tracking-[0.06em] uppercase text-mute"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  { n: "Carla Méndez", e: "carla.m@email.com", j: "ene 2024", o: 8, s: "verified" as const, l: "Activo" },
                  { n: "Javier T.", e: "jt@email.com", j: "feb 2024", o: 3, s: "verified" as const, l: "Activo" },
                  { n: "Anónimo", e: "anon@x.com", j: "ago 2024", o: 0, s: "alert" as const, l: "Sospechoso" },
                ].map((u, i) => (
                  <tr key={i} className="border-b border-[var(--color-line)] last:border-b-0">
                    <td className="p-4 flex items-center gap-2">
                      <Avatar initials={u.n.split(" ").map((w) => w[0]).join("")} size={32} />
                      <span className="font-semibold">{u.n}</span>
                    </td>
                    <td className="p-4 mono text-xs">{u.e}</td>
                    <td className="p-4">
                      <Badge kind={u.s}>{u.l}</Badge>
                    </td>
                    <td className="p-4 text-mute">{u.j}</td>
                    <td className="p-4">{u.o}</td>
                    <td className="p-4">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="pros">
          <CrudHeader
            title="Profesionales"
            subtitle={`${formatNumber(PROFESSIONALS.length)} en este conjunto`}
          />
          <div className="ls-card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[var(--color-paper-2)] border-b border-[var(--color-line)]">
                  {["Pro", "Categoría", "Rating", "Trabajos", "Estado", "Acción"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left p-4 mono text-[11px] tracking-[0.06em] uppercase text-mute"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {PROFESSIONALS.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-line)] last:border-b-0">
                    <td className="p-4 flex items-center gap-2">
                      <Avatar initials={p.initials} size={32} />
                      <span className="font-semibold">{p.name}</span>
                    </td>
                    <td className="p-4 text-mute">{p.category}</td>
                    <td className="p-4 mono">{p.rating}</td>
                    <td className="p-4">{p.jobsDone}</td>
                    <td className="p-4">
                      {p.verified ? (
                        <Badge kind="verified">verif</Badge>
                      ) : (
                        <Badge kind="alert">pendiente</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <CrudHeader title="Reseñas" subtitle={`${REVIEWS.length} reseñas registradas`} />
          <div className="ls-card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[var(--color-paper-2)] border-b border-[var(--color-line)]">
                  {["#Orden", "Usuario", "Pro", "Rating", "Estado", "Acción"].map((h) => (
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
                {REVIEWS.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--color-line)] last:border-b-0">
                    <td className="p-4">
                      <Pill>#{r.orderId}</Pill>
                    </td>
                    <td className="p-4 font-semibold">{r.user}</td>
                    <td className="p-4">{r.proId}</td>
                    <td className="p-4 mono">{r.rating}/5</td>
                    <td className="p-4">
                      {r.flagged ? (
                        <Badge kind="alert">flag</Badge>
                      ) : (
                        <Badge kind="verified">ok</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="ordenes">
          <CrudHeader title="Órdenes" subtitle="48,302 totales · 148 hoy" />
          <div className="ls-card overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-[var(--color-paper-2)] border-b border-[var(--color-line)]">
                  {["#Orden", "Cliente", "Pro", "Estado", "Total", "Acción"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left p-4 mono text-[11px] tracking-[0.06em] uppercase text-mute"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  { o: "LS-2A98F1", c: "Carla M.", p: "Marcos R.", st: "Curso", v: "€35", k: "signal" as const },
                  { o: "LS-2A88D0", c: "Javier T.", p: "Marcos R.", st: "Cerrada", v: "€95", k: "verified" as const },
                  { o: "LS-2A7012", c: "Núria B.", p: "Marcos R.", st: "Cerrada", v: "€140", k: "verified" as const },
                  { o: "LS-2A5511", c: "Anónimo", p: "Marcos R.", st: "Cancel.", v: "—", k: "alert" as const },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-[var(--color-line)] last:border-b-0">
                    <td className="p-4">
                      <Pill>#{r.o}</Pill>
                    </td>
                    <td className="p-4 font-semibold">{r.c}</td>
                    <td className="p-4">{r.p}</td>
                    <td className="p-4">
                      <Badge kind={r.k}>{r.st}</Badge>
                    </td>
                    <td className="p-4 font-semibold">{r.v}</td>
                    <td className="p-4">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="categorias">
          <CrudHeader title="Categorías" subtitle={`${CATEGORIES.length} activas`} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="ls-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <CatIcon name={c.icon} size={24} />
                  <ActionButtons compact />
                </div>
                <div className="font-display text-2xl">{c.name}</div>
                <div className="text-mute text-xs mt-1">{c.hero}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-line)]">
                  <span className="mono text-xs">{formatNumber(c.count)} pros</span>
                  <Badge kind="verified">activa</Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admins">
          <CrudHeader title="Admins" subtitle="3 roles · ES-1, ES-2, ES-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { n: "Elena Pardo", r: "moderación · ES-1", k: "signal" as const },
              { n: "David Ruiz", r: "soporte · ES-2", k: "ink" as const },
              { n: "Marta Lin", r: "compliance · ES-3", k: "ink" as const },
            ].map((a) => (
              <div key={a.n} className="ls-card p-5">
                <div className="flex items-center gap-3">
                  <Avatar initials={a.n.split(" ").map((w) => w[0]).join("")} size={42} signal />
                  <div>
                    <div className="font-semibold">{a.n}</div>
                    <div className="mono text-xs text-mute">{a.r}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    Revocar
                  </Button>
                </div>
              </div>
            ))}
            <button className="ls-card p-5 border-dashed flex items-center justify-center text-mute cursor-pointer hover:border-[var(--color-ink)] transition-colors">
              <Plus className="h-4 w-4" /> Añadir admin
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CrudHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
      <div>
        <h2 className="h-display text-[28px] md:text-[36px]">{title}</h2>
        <div className="text-mute text-sm">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Input placeholder="Buscar..." className="w-[200px] md:w-[260px]" />
        <Button variant="signal" className="hover-signal">
          <Plus className="h-3.5 w-3.5" /> Nuevo
        </Button>
      </div>
    </div>
  );
}

function ActionButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <Button variant="icon" size="icon-sm">
        <Pencil className="h-3 w-3" />
      </Button>
      {!compact && (
        <Button variant="icon" size="icon-sm">
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
