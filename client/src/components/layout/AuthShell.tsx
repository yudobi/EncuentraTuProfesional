import { Outlet } from "react-router";
import { Brand } from "@/components/brand/Brand";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function AuthShell() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <header className="border-b border-[var(--color-line)] py-3.5 px-5 md:px-10 flex items-center gap-4">
        <Brand size={28} />
        <div className="flex-1" />
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-mute hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
