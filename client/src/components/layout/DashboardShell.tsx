import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Shield,
  Star,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const proItems = [
  { to: "/panel", icon: LayoutDashboard, label: "Resumen" },
  { to: "/panel?tab=citas", icon: Calendar, label: "Citas" },
  { to: "/panel?tab=solicitudes", icon: MessageSquare, label: "Solicitudes" },
  { to: "/panel?tab=ingresos", icon: Wallet, label: "Ingresos" },
  { to: "/panel?tab=reviews", icon: Star, label: "Reseñas" },
  { to: "/panel?tab=stats", icon: BarChart3, label: "Estadísticas" },
  { to: "/panel?tab=ajustes", icon: UserCog, label: "Ajustes" },
];

const adminItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Resumen" },
  { to: "/admin?tab=validacion", icon: Shield, label: "Validación" },
  { to: "/admin?tab=reviews", icon: Star, label: "Reseñas" },
  { to: "/admin?tab=chats", icon: MessageSquare, label: "Chats" },
  { to: "/admin?tab=notificaciones", icon: Bell, label: "Notificaciones" },
];

const superItems = [
  { to: "/super-admin", icon: LayoutDashboard, label: "Resumen" },
  { to: "/super-admin?tab=usuarios", icon: Users, label: "Usuarios" },
  { to: "/super-admin?tab=pros", icon: UserCog, label: "Profesionales" },
  { to: "/super-admin?tab=reviews", icon: Star, label: "Reseñas" },
  { to: "/super-admin?tab=ordenes", icon: FileText, label: "Órdenes" },
  { to: "/super-admin?tab=categorias", icon: Database, label: "Categorías" },
];

export function DashboardShell() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const items = location.pathname.startsWith("/super-admin")
    ? superItems
    : location.pathname.startsWith("/admin")
      ? adminItems
      : proItems;

  const title = location.pathname.startsWith("/super-admin")
    ? "Super-Admin"
    : location.pathname.startsWith("/admin")
      ? "Admin"
      : "Panel Profesional";

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-[var(--color-line)] flex items-center gap-2.5">
        <Brand size={26} />
      </div>
      <div className="px-5 py-4 border-b border-[var(--color-line)]">
        <div className="eyebrow mb-2">Sesión</div>
        <div className="flex items-center gap-2.5">
          <Avatar initials="MR" size={36} signal />
          <div className="text-sm">
            <div className="font-semibold">Marcos R.</div>
            <div className="text-mute text-xs">{title}</div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col py-2 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={false}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                  "hover:bg-[var(--color-paper-2)]",
                  isActive && "bg-[var(--color-paper-2)] font-semibold",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-[var(--color-line)] p-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-mute hover:text-[var(--color-ink)] rounded transition-colors"
        >
          <LogOut className="h-4 w-4" /> Salir
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-paper)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-[var(--color-line)] sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden border-b border-[var(--color-line)] px-4 py-3 flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="icon" size="icon-sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Menú panel</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="font-display text-lg">{title}</div>
          <div className="flex-1" />
          <Avatar initials="MR" size={32} signal />
        </header>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
