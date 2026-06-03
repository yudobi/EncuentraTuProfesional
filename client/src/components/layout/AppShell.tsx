import { Outlet, useLocation } from "react-router";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Nav variant="full" />
      <main className={`flex-1 ${isHome ? "" : "pb-16 md:pb-0"}`}>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
