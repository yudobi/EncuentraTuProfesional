import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Bell, MessageSquare, Menu, Search, User } from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/atoms/Avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavProps {
  variant?: "full" | "minimal";
  isLogged?: boolean;
}

export function Nav({ variant = "full", isLogged = false }: NavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === "/categorias" && location.pathname.startsWith("/categorias")) ||
    (path === "/" && location.pathname === "/");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/resultados${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-paper)] sticky top-0 z-30">
      <div className="ls-container">
        <div className="flex items-center gap-4 md:gap-8 py-3.5 md:py-4">
          <Brand size={28} />

          {variant === "full" && (
            <>
              {/* Desktop search */}
              <form
                onSubmit={submitSearch}
                className="hidden lg:flex items-center border border-[var(--color-line)] rounded-full pl-5 pr-1.5 py-1.5 bg-paper flex-1 max-w-[420px] transition-all focus-within:border-[var(--color-ink)] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                <Search className="h-4 w-4 text-mute" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="¿Qué necesitas?"
                  className="ml-2 border-0 bg-transparent outline-none flex-1 text-sm py-2"
                />
                <div className="w-px h-5 bg-[var(--color-line)] mx-3" />
                <span className="text-mute text-xs">Madrid</span>
                <Button
                  type="submit"
                  variant="signal"
                  size="sm"
                  className="ml-2.5 hover-signal"
                >
                  Buscar
                </Button>
              </form>

              <div className="hidden md:flex flex-1" />

              {/* Desktop nav links */}
              <nav className="hidden md:flex items-center gap-7 text-sm">
                <Link
                  to="/"
                  className={cn(
                    "py-1.5 border-b border-transparent transition-colors",
                    isActive("/") && "border-[var(--color-ink)]",
                  )}
                >
                  Inicio
                </Link>
                <Link
                  to="/categorias"
                  className={cn(
                    "py-1.5 border-b border-transparent transition-colors",
                    isActive("/categorias") && "border-[var(--color-ink)]",
                  )}
                >
                  Categorías
                </Link>
                <Link
                  to="/auth?mode=pro_signup"
                  className="py-1.5 border-b border-transparent hover:border-[var(--color-ink)]"
                >
                  Soy profesional
                </Link>
              </nav>
            </>
          )}

          {variant === "minimal" && <div className="flex-1" />}

          <div className="flex items-center gap-2 ml-auto">
            {isLogged && (
              <>
                <Button variant="icon" size="icon-sm" className="hidden sm:flex">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="icon"
                  size="icon-sm"
                  className="hidden sm:flex"
                  onClick={() => navigate("/chat")}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </>
            )}
            {!isLogged ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => navigate("/auth?mode=user_login")}
                >
                  Entrar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => navigate("/auth?mode=user_signup")}
                >
                  Registro
                </Button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 p-1 border border-[var(--color-line)] rounded-full cursor-pointer hover:border-[var(--color-ink)] transition-colors">
                <Menu className="h-3.5 w-3.5 ml-1.5" />
                <Avatar initials="CM" size={28} />
              </div>
            )}

            {/* Mobile drawer trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="icon" size="icon-sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] max-w-sm p-0">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <nav className="flex flex-col">
                    {[
                      { to: "/", label: "Inicio" },
                      { to: "/categorias", label: "Categorías" },
                      { to: "/resultados", label: "Buscar pros" },
                      { to: "/chat", label: "Mensajes" },
                      { to: "/auth?mode=pro_signup", label: "Soy profesional" },
                    ].map((item) => (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          className="px-5 py-4 border-b border-[var(--color-line)] hover:bg-[var(--color-paper-2)] transition-colors text-base"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-5 flex flex-col gap-3 border-t border-[var(--color-line)] mt-4">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-center h-11"
                        onClick={() => navigate("/auth?mode=user_login")}
                      >
                        <User className="h-4 w-4" /> Entrar
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="signal"
                        className="w-full justify-center h-11 hover-signal"
                        onClick={() => navigate("/auth?mode=user_signup")}
                      >
                        Crear cuenta
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search (below row on mobile) */}
        {variant === "full" && (
          <form
            onSubmit={submitSearch}
            className="flex lg:hidden items-center border border-[var(--color-line)] rounded-full pl-4 pr-1 py-1 bg-paper mb-3.5 transition-all focus-within:border-[var(--color-ink)]"
          >
            <Search className="h-4 w-4 text-mute shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="¿Qué necesitas?"
              className="ml-2 border-0 bg-transparent outline-none flex-1 text-sm py-2 min-w-0"
            />
            <Button
              type="submit"
              variant="signal"
              size="sm"
              className="ml-1 shrink-0 hover-signal"
            >
              Buscar
            </Button>
          </form>
        )}
      </div>
    </header>
  );
}
