import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "../../content/landing";
import type { ThemeMode } from "../../features/theme/theme";
import { ThemeSelector } from "../../features/theme/ThemeSelector";

type SiteHeaderProps = {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
};

export function SiteHeader({ themeMode, onThemeChange }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <a className="group flex items-center gap-3" href="#inicio" aria-label="DGBM Risk Control, inicio">
          <span className="relative grid h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10">
            <img className="absolute -left-[17px] -top-[17px] h-[74px] w-[74px] max-w-none" src="/img/logo.png" alt="" />
          </span>
          <span>
            <span className="block text-sm font-black tracking-tight text-slate-950 dark:text-white">DGBM</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              Risk Control
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <a
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeSelector compact onChange={onThemeChange} value={themeMode} />
          <a className="btn-primary h-10 px-4" href="#herramienta">
            Calcular operación
          </a>
        </div>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 dark:border-white/10 dark:text-white lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1" aria-label="Navegación móvil">
            {NAV_ITEMS.map((item) => (
              <a
                className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mx-auto mt-3 flex max-w-7xl items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
            <span className="text-xs font-bold text-slate-500">Apariencia</span>
            <ThemeSelector compact onChange={onThemeChange} value={themeMode} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
