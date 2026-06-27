import {
  BarChart3,
  Bot,
  Calculator,
  Menu,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X
} from "lucide-react";
import { useState } from "react";
import { FEE_VERIFIED_AT } from "../../data/fees";
import { ThemeSelector } from "../../features/theme/ThemeSelector";
import type { ThemeMode } from "../../features/theme/theme";

type SidebarProps = {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
};

const navigation = [
  { href: "#calculator", label: "Calculadora", icon: Calculator },
  { href: "#results", label: "Resultados", icon: BarChart3 },
  { href: "#assistant", label: "Asistente de size", icon: Bot }
];

export function Sidebar({ themeMode, onThemeChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="panel min-w-0 self-start p-5 lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            alt="Logo de DGBM Risk Control"
            className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 bg-white object-contain dark:border-slate-700"
            height="64"
            src="/img/logo.png"
            width="64"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Risk Control</p>
            <h1 className="break-words text-xl font-extrabold">DGBM Calculator</h1>
          </div>
        </div>

        <button
          aria-controls="sidebar-content"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="grid h-10 w-10 shrink-0 place-items-center border border-slate-300 text-slate-900 lg:hidden dark:border-slate-700 dark:text-slate-100"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} lg:block`} id="sidebar-content">
        <nav className="mt-6 border-y border-slate-200 py-3 dark:border-slate-800" aria-label="Navegación principal">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <a
                    className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300"
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <ThemeSelector onChange={onThemeChange} value={themeMode} />

        <div className="muted mt-8 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <p className="min-w-0 break-words">Calcula tamaño de posición por riesgo fijo y stop real.</p>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
            <p className="min-w-0 break-words">Proyecta objetivos 1:1 a 1:5 con ganancia bruta y neta.</p>
          </div>
          <div className="flex items-start gap-3">
            <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" aria-hidden="true" />
            <p className="min-w-0 break-words">Soporta Spot, Futures, maker/taker y fees personalizados.</p>
          </div>
        </div>

        <div className="muted-soft mt-8 border-t border-slate-200 pt-5 text-xs leading-5 dark:border-slate-800">
          Fees base VIP 0 verificados el {FEE_VERIFIED_AT}. Son defaults editables; revisa siempre tu fee real de cuenta.
        </div>
      </div>
    </aside>
  );
}
