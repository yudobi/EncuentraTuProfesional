import { Link, useLocation } from "react-router";
import { Home, Grid3x3, Search, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/categorias", icon: Grid3x3, label: "Categorías" },
  { to: "/resultados", icon: Search, label: "Buscar" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/auth?mode=user_login", icon: User, label: "Cuenta" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to.split("?")[0]);
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--color-paper)] border-t border-[var(--color-line)] grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const active = isActive(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] transition-colors",
              active
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-mute)] hover:text-[var(--color-ink)]",
            )}
          >
            <Icon className={cn("h-5 w-5", active && "stroke-[2.2]")} />
            <span className={cn("mono tracking-tight", active && "font-semibold")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
