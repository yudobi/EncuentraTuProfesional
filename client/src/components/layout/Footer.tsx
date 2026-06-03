import { LSLogo } from "@/components/brand/LSLogo";

interface FooterColProps {
  title: string;
  items: string[];
}

function FooterCol({ title, items }: FooterColProps) {
  return (
    <div>
      <div className="mono text-[10px] text-mute-2 uppercase tracking-[0.08em] mb-4">
        {title}
      </div>
      <div className="flex flex-col gap-2.5 text-sm">
        {items.map((i) => (
          <a
            key={i}
            href="#"
            className="text-paper no-underline cursor-pointer hover:text-[var(--color-signal)] transition-colors"
          >
            {i}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-paper)] px-5 md:px-10 pt-14 pb-24 md:pb-8">
      <div className="ls-container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <LSLogo size={32} />
              <span className="font-display text-2xl">LinkService</span>
            </div>
            <p className="text-mute-2 text-xs mt-3.5 max-w-[280px] leading-relaxed">
              La plataforma que conecta a personas con profesionales verificados.
              Servicios como producto, reputación como ventaja.
            </p>
          </div>
          <FooterCol title="Plataforma" items={["Cómo funciona", "Categorías", "Buscar", "App móvil"]} />
          <FooterCol title="Profesionales" items={["Crear perfil", "Comisiones", "Tutorial", "Soporte Pro"]} />
          <FooterCol title="Confianza" items={["Verificación", "Reseñas", "Términos", "Privacidad"]} />
          <FooterCol title="Empresa" items={["Nosotros", "Prensa", "Contacto", "Trabajos"]} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-[var(--color-ink-3)] mt-12 pt-6 text-mute-2 text-xs">
          <span className="mono">© 2026 LinkService — Todos los oficios, una sola plataforma</span>
          <span className="mono">v1.0 · Madrid · ES</span>
        </div>
      </div>
    </footer>
  );
}
