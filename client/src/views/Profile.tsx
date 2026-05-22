import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Check,
  Clock,
  Globe,
  Heart,
  Lock,
  MessageSquare,
  Phone,
  Shield,
  Star,
} from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { PhImg } from "@/components/atoms/PhImg";
import { Avatar } from "@/components/atoms/Avatar";
import { Stars } from "@/components/atoms/Stars";
import { Pill } from "@/components/atoms/Pill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfessional } from "@/hooks/useProfessionals";
import { useReviewsByPro } from "@/hooks/useReviews";
import { formatNumber } from "@/lib/utils";
import type { Review } from "@/types";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pro } = useProfessional(id || "p001");
  const { data: allReviews = [] } = useReviewsByPro(pro?.id);
  const reviews = allReviews.filter((r) => !r.flagged);
  const [showContact, setShowContact] = useState(false);

  if (!pro) return null;

  return (
    <div className="fade-up">
      {/* HERO galería */}
      <section className="bg-paper border-b border-[var(--color-line)]">
        <div className="ls-container pt-5 pb-0">
          <div className="flex items-center gap-2 text-xs text-mute mb-3.5 flex-wrap">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <Link to="/resultados">Profesionales</Link>
            <span>/</span>
            <span className="text-[var(--color-ink)]">{pro.name}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-1.5 h-[280px] md:h-[380px]">
            <PhImg
              label="portfolio · principal"
              className="h-full rounded-l-lg md:rounded-tr-none rounded-r-lg md:rounded-r-none"
            />
            <div className="hidden md:grid grid-rows-2 gap-1.5">
              <PhImg label="trabajo 02" className="rounded-none" />
              <PhImg label="trabajo 03" className="rounded-none" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-1.5">
              <PhImg label="trabajo 04" className="rounded-tr-lg rounded-l-none rounded-br-none" />
              <PhImg
                label={`+${Math.max(0, pro.gallery.length - 4)} fotos`}
                className="rounded-br-lg rounded-bl-none rounded-tr-none bg-[var(--color-ink)] text-[var(--color-paper)] font-semibold"
                style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ls-section pt-8 md:pt-9">
        <div className="ls-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">
            <div>
              <div className="flex items-start gap-4 md:gap-5 mb-2.5">
                <Avatar
                  initials={pro.initials}
                  size={64}
                  signal={pro.badges.includes("Top Pro")}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="h-display text-[32px] md:text-[42px] leading-none">
                      {pro.name}
                    </h1>
                    {pro.verified && (
                      <Badge kind="verified">
                        <Check className="h-2.5 w-2.5" /> verificado
                      </Badge>
                    )}
                    {pro.badges.includes("Top Pro") && (
                      <Badge kind="signal">top pro</Badge>
                    )}
                  </div>
                  <div className="text-mute">
                    {pro.title} · {pro.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 py-4 border-y border-[var(--color-line)]">
                <StatLine n={pro.rating.toString()} label={`${pro.reviewCount} reseñas`} starIcon />
                <StatLine n={formatNumber(pro.jobsDone)} label="trabajos completados" />
                <StatLine n={`~${pro.responseMin}m`} label="tiempo de respuesta" />
                <StatLine n={`${pro.distanceKm}km`} label="distancia" />
              </div>

              <Tabs defaultValue="about" className="mt-7">
                <TabsList className="overflow-x-auto scroll-x">
                  <TabsTrigger value="about">Sobre mí</TabsTrigger>
                  <TabsTrigger value="skills">Especialidades</TabsTrigger>
                  <TabsTrigger value="reviews">Reseñas ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="schedule">Disponibilidad</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <p className="text-base leading-relaxed max-w-[640px]">{pro.bio}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-7">
                    {[
                      {
                        i: Shield,
                        t: "Identidad verificada",
                        d: "DNI y certificación profesional",
                      },
                      { i: Check, t: "Garantía de servicio", d: "30 días en cada trabajo" },
                      {
                        i: Clock,
                        t: "Puntualidad",
                        d: "98% llega a tiempo según reseñas",
                      },
                      { i: Globe, t: "Idiomas", d: "Español, inglés, catalán" },
                    ].map((x) => (
                      <div
                        key={x.t}
                        className="flex items-start gap-3.5 p-4 bg-[var(--color-paper-2)] rounded-lg"
                      >
                        <x.i className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-sm">{x.t}</div>
                          <div className="text-mute text-xs">{x.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="skills">
                  <Eyebrow>Especialidades verificadas</Eyebrow>
                  <div className="flex flex-wrap gap-2 mt-3.5">
                    {pro.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center px-4 py-2.5 border border-[var(--color-line)] rounded-full text-sm hover:border-[var(--color-ink)] transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <Eyebrow className="mt-8">Equipamiento propio</Eyebrow>
                  <div className="text-mute mt-3 text-sm leading-relaxed">
                    Cámara endoscópica · Detector de fugas por ultrasonido · Herramienta
                    certificada · Vehículo propio
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="flex flex-col gap-4">
                    <div className="ls-card p-6 bg-[var(--color-ink)] text-[var(--color-paper)]">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="h-display text-[44px] md:text-[56px] leading-none">
                            {pro.rating}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Stars value={5} />
                            <span className="mono text-xs text-mute-2">
                              · {pro.reviewCount} reseñas verificadas
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 md:min-w-[220px]">
                          {[5, 4, 3, 2, 1].map((s) => (
                            <div key={s} className="flex items-center gap-2 text-xs">
                              <span className="mono w-3">{s}</span>
                              <div className="flex-1 h-1 bg-[var(--color-ink-3)] rounded-full">
                                <div
                                  className="h-full bg-[var(--color-signal)] rounded-full"
                                  style={{
                                    width: `${s === 5 ? 86 : s === 4 ? 10 : 2}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {reviews.map((r) => (
                      <ReviewCard key={r.id} r={r} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="schedule">
                  <Eyebrow>Próxima disponibilidad</Eyebrow>
                  <div className="grid grid-cols-7 gap-1.5 mt-4">
                    {["Hoy", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun"].map((d, i) => (
                      <div
                        key={d}
                        className="ls-card p-2 md:p-3.5 text-center"
                        style={{
                          background:
                            i === 0 ? "var(--color-signal)" : "var(--color-paper)",
                          borderColor:
                            i === 0 ? "var(--color-ink)" : "var(--color-line)",
                        }}
                      >
                        <div className="mono text-[10px] md:text-xs">{d}</div>
                        <div className="h-display text-xl md:text-2xl mt-1">{4 + i}</div>
                        <div className="text-mute text-[10px] md:text-xs mt-1.5">
                          {i < 4 ? "3 huecos" : "Ocupado"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-mute text-xs mt-4">{pro.schedule[0]}</div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking card */}
            <aside>
              <div className="ls-card p-6 shadow-[6px_6px_0_var(--color-ink)] border-[var(--color-ink)] lg:sticky lg:top-24">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xl md:text-[22px]">
                      desde €{pro.priceFrom}
                      <span className="text-mute text-sm font-normal">/h</span>
                    </div>
                    <div className="text-mute text-xs">Presupuesto cerrado tras chat</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="mono font-semibold">{pro.rating}</span>
                  </div>
                </div>

                <div className="mt-5 p-3.5 border border-dashed border-[var(--color-line)] rounded-md">
                  <Eyebrow>Opción 1 — Por la plataforma</Eyebrow>
                  <div className="text-[13px] mt-2 leading-relaxed">
                    Chat dentro de LinkService. Genera orden única. Necesario para dejar
                    reseña.
                  </div>
                  <Button
                    variant="signal"
                    className="w-full justify-center mt-3 hover-signal"
                    onClick={() => navigate(`/chat/${pro.id}`)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Abrir chat
                  </Button>
                </div>

                <div className="mt-3 p-3.5 border border-dashed border-[var(--color-line)] rounded-md">
                  <Eyebrow>Opción 2 — Contacto privado</Eyebrow>
                  <div className="text-[13px] mt-2 leading-relaxed">
                    WhatsApp / teléfono directo. Notificamos al pro tras 24h para
                    confirmar la cita.
                  </div>
                  {!showContact ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-center mt-3"
                      onClick={() => setShowContact(true)}
                    >
                      <Lock className="h-3.5 w-3.5" /> Ver datos de contacto
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-3">
                      {pro.contact.whatsapp && (
                        <Button variant="ghost" className="w-full justify-start">
                          <Phone className="h-4 w-4 text-[#25D366]" /> +34 6•• ••• 412
                        </Button>
                      )}
                      {pro.contact.phone && (
                        <Button variant="ghost" className="w-full justify-start">
                          <Phone className="h-4 w-4" /> +34 9•• ••• 198
                        </Button>
                      )}
                      <div className="text-xs text-mute pt-2 border-t border-[var(--color-line)] mt-1">
                        Solo usuarios registrados. Notificación al pro: <b>en 24h</b>.
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[var(--color-line)] text-xs">
                  <button className="underline flex items-center gap-1">
                    <Heart className="h-3 w-3" /> Guardar
                  </button>
                  <button className="underline">Compartir</button>
                  <button className="underline">Reportar</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatLine({
  n,
  label,
  starIcon,
}: {
  n: string;
  label: string;
  starIcon?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1">
        {starIcon && <Star className="h-3.5 w-3.5 fill-current" />}
        <span className="h-display text-[22px] md:text-[26px] leading-none">{n}</span>
      </div>
      <div className="text-mute text-xs mt-1">{label}</div>
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="ls-card p-5">
      <div className="flex items-start justify-between gap-3 mb-2.5 flex-wrap">
        <div className="flex items-center gap-3">
          <Avatar initials={r.initials} size={36} />
          <div>
            <div className="font-semibold text-sm">{r.user}</div>
            <div className="text-mute text-xs">hace {r.daysAgo} días</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stars value={r.rating} />
          <Pill>orden #{r.orderId}</Pill>
        </div>
      </div>
      <p className="m-0 mt-2.5 text-sm leading-relaxed">{r.text}</p>
      {r.proReply && (
        <div className="mt-3.5 p-3.5 bg-[var(--color-paper-2)] rounded-md border-l-2 border-[var(--color-ink)]">
          <div className="mono text-[10px] mb-1.5 uppercase tracking-[0.08em] text-mute">
            Respuesta del profesional
          </div>
          <div className="text-sm">{r.proReply}</div>
        </div>
      )}
    </div>
  );
}
