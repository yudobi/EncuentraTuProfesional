import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Calendar,
  Check,
  Lock,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Wallet,
} from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROFESSIONALS, CHAT_MESSAGES } from "@/data/mocks";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export default function Chat() {
  const navigate = useNavigate();
  const { proId } = useParams();
  const pro = PROFESSIONALS.find((p) => p.id === proId) || PROFESSIONALS[0];
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", t: "ahora", text: input }]);
    setInput("");
  };

  const confirmAppt = () => {
    navigate(`/orden/LS-2A98F1`);
  };

  return (
    <div className="fade-up bg-paper">
      <div className="ls-container px-0 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] border border-[var(--color-line)] min-h-[calc(100vh-64px)]">
          {/* Convs list */}
          <aside className="border-r border-[var(--color-line)] p-4 hidden lg:block overflow-y-auto">
            <Eyebrow>Conversaciones</Eyebrow>
            <div className="flex items-center border border-[var(--color-line)] rounded-md px-3 py-1.5 mt-3.5 bg-paper">
              <Search className="h-3.5 w-3.5 text-mute shrink-0" />
              <input
                placeholder="Buscar..."
                className="ml-2 border-0 bg-transparent outline-none flex-1 text-sm py-1.5 min-w-0"
              />
            </div>
            <div className="flex flex-col gap-1 mt-4">
              {PROFESSIONALS.slice(0, 5).map((p, i) => {
                const active = i === 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/chat/${p.id}`)}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-md cursor-pointer text-left transition-colors border-l-2 hover:bg-[var(--color-paper-2)]",
                      active
                        ? "bg-[var(--color-paper-2)] border-[var(--color-ink)]"
                        : "border-transparent",
                    )}
                  >
                    <Avatar initials={p.initials} size={36} signal={active} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[13px]">{p.name}</span>
                        <span className="mono text-[10px] text-mute">
                          {i === 0 ? "ahora" : `${i + 1}d`}
                        </span>
                      </div>
                      <div className="text-mute text-[11px] truncate">
                        {i === 0 ? "Marcos propuso una cita..." : "Conversación previa..."}
                      </div>
                    </div>
                    {active && (
                      <span className="w-2 h-2 bg-[var(--color-signal)] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Thread */}
          <div className="flex flex-col bg-[var(--color-paper-2)] min-h-[calc(100vh-64px)]">
            <header className="flex items-center justify-between p-4 md:px-6 bg-paper border-b border-[var(--color-line)]">
              <div className="flex items-center gap-3">
                <Avatar initials={pro.initials} size={40} signal />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{pro.name}</span>
                    {pro.verified && <Badge kind="verified">verif</Badge>}
                  </div>
                  <div className="text-mute text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full" />
                    En línea · ~{pro.responseMin} min
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="icon" size="icon-sm">
                  <Phone className="h-3.5 w-3.5" />
                </Button>
                <Button variant="icon" size="icon-sm">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex justify-center mb-4">
                <span className="mono text-[10px] text-mute bg-paper px-3 py-1 rounded-full border border-[var(--color-line)]">
                  HOY · ADMIN registró el inicio de conversación
                </span>
              </div>
              {messages.map((m, i) => (
                <Message key={i} m={m} />
              ))}
              {scheduling && (
                <div className="flex justify-center my-5">
                  <div className="ls-card p-5 max-w-[380px] border-[var(--color-ink)] shadow-[4px_4px_0_var(--color-ink)]">
                    <Eyebrow>Confirma la cita</Eyebrow>
                    <div className="font-semibold mt-2 text-base">Hoy · 17:30</div>
                    <div className="text-mute text-xs mt-1">
                      Diagnóstico de fuga · 35€
                    </div>
                    <div className="flex gap-2 mt-3.5">
                      <Button
                        variant="signal"
                        size="sm"
                        className="flex-1 justify-center hover-signal"
                        onClick={confirmAppt}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setScheduling(false)}
                      >
                        Más tarde
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-paper border-t border-[var(--color-line)]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <QuickChip onClick={() => setScheduling(true)}>
                  <Calendar className="h-3 w-3" /> Agendar cita
                </QuickChip>
                <QuickChip>
                  <Paperclip className="h-3 w-3" /> Adjuntar foto
                </QuickChip>
                <QuickChip>
                  <Wallet className="h-3 w-3" /> Pedir presupuesto
                </QuickChip>
              </div>
              <div className="flex items-center gap-2 border border-[var(--color-line)] rounded-full p-1 pl-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Escribe un mensaje..."
                  className="border-0 h-9 px-0 focus:border-0"
                />
                <Button variant="signal" size="sm" onClick={send} className="hover-signal">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="text-mute text-[11px] mt-2 text-center flex items-center justify-center gap-1">
                <Lock className="h-2.5 w-2.5" /> Conversación cifrada · ADMIN puede revisar
                en disputas
              </div>
            </div>
          </div>

          {/* Right rail (details) */}
          <aside className="border-l border-[var(--color-line)] p-5 bg-paper hidden xl:block overflow-y-auto">
            <Eyebrow>Sobre el profesional</Eyebrow>
            <div className="flex flex-col items-center gap-2 py-5 border-b border-[var(--color-line)]">
              <Avatar initials={pro.initials} size={64} signal />
              <div className="font-semibold">{pro.name}</div>
              <div className="text-mute text-xs">{pro.title}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pro/${pro.id}`)}
              >
                Ver perfil completo
              </Button>
            </div>

            <Eyebrow className="mt-5">Estado de la conversación</Eyebrow>
            <div className="flex flex-col gap-2.5 mt-3.5">
              <CheckRow done label="Conversación iniciada" />
              <CheckRow done label="Detalles intercambiados" />
              <CheckRow done={scheduling} label="Cita propuesta" />
              <CheckRow label="Orden generada" sub="Necesario para reseñar" />
              <CheckRow label="Servicio completado" />
              <CheckRow label="Reseña publicada" />
            </div>

            <div className="mt-5 p-3.5 bg-[var(--color-paper-2)] rounded-md">
              <div className="mono text-[10px] text-mute uppercase">
                Notificado al admin
              </div>
              <div className="text-[11px] mt-1.5 leading-relaxed">
                Toda actividad en este chat queda registrada para soporte y disputas.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Message({ m }: { m: ChatMessage }) {
  if (m.from === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="ls-card px-4 py-2.5 bg-[var(--color-signal)] border-[var(--color-ink)] text-sm font-medium flex items-center gap-2">
          <Calendar className="h-3 w-3" /> {m.text}
        </div>
      </div>
    );
  }
  const isUser = m.from === "user";
  return (
    <div
      className={cn(
        "flex mb-2.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div className="max-w-[78%] md:max-w-[70%]">
        <div
          className={cn(
            "px-3.5 py-2.5 text-sm leading-snug border",
            isUser
              ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)] rounded-[12px_12px_2px_12px]"
              : "bg-paper text-[var(--color-ink)] border-[var(--color-line)] rounded-[12px_12px_12px_2px]",
          )}
        >
          {m.text}
        </div>
        <div
          className={cn(
            "mono text-[10px] text-mute mt-1",
            isUser ? "text-right" : "text-left",
          )}
        >
          {m.t}
        </div>
      </div>
    </div>
  );
}

function QuickChip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-line)] rounded-full text-xs hover:border-[var(--color-ink)] transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

function CheckRow({
  done,
  label,
  sub,
}: {
  done?: boolean;
  label: string;
  sub?: string;
}) {
  return (
    <div className={cn("flex items-start gap-2.5 text-[13px]", !done && "opacity-50")}>
      <div
        className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: done ? "var(--color-signal)" : "var(--color-paper-2)",
          border: `1px solid ${done ? "var(--color-ink)" : "var(--color-line)"}`,
        }}
      >
        {done && <Check className="h-2.5 w-2.5" />}
      </div>
      <div>
        <div className={cn(done && "font-medium")}>{label}</div>
        {sub && <div className="text-mute text-xs">{sub}</div>}
      </div>
    </div>
  );
}
