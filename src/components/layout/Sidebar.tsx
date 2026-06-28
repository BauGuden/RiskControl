import {
  Bot,
  Calculator,
  Check,
  Code2,
  Menu,
  ShieldCheck,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FEE_VERIFIED_AT } from "../../data/fees";
import { ThemeSelector } from "../../features/theme/ThemeSelector";
import type { ThemeMode } from "../../features/theme/theme";

type SidebarProps = {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
};

const navigation = [
  { href: "#calculator", label: "Calculadora", description: "Configura la operación", icon: Calculator },
  { href: "#assistant", label: "Asistente", description: "Calcula desde el chat", icon: Bot }
];

type SidebarContentProps = SidebarProps & {
  activeSection: string;
  onNavigate: (href: string) => void;
  onClose?: () => void;
};

function Brand() {
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700">
        <img
          alt=""
          className="absolute -top-3 left-1/2 h-[115px] w-[115px] max-w-none -translate-x-1/2 object-contain"
          height="115"
          src="/img/logo.png"
          width="115"
        />
      </div>
      <div className="mt-2.5 min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          DGBM
        </p>
        <p className="truncate text-lg font-extrabold tracking-tight">Risk Control</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Crypto calculator</p>
      </div>
    </div>
  );
}

function SidebarContent({
  activeSection,
  onNavigate,
  onClose,
  onThemeChange,
  themeMode
}: SidebarContentProps) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="relative flex items-start justify-center">
        <Brand />
        {onClose ? (
          <button
            aria-label="Cerrar menú"
            className="absolute right-0 top-0 grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-teal-700/15 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav className="mt-6" aria-label="Navegación principal">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Herramientas
        </p>
        <ul className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.href.slice(1);

            return (
              <li key={item.href}>
                <a
                  aria-current={active ? "location" : undefined}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition focus:outline-none focus:ring-4 focus:ring-teal-700/15 ${
                    active
                      ? "bg-teal-50 text-teal-900 dark:bg-teal-400/10 dark:text-teal-200"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                  href={item.href}
                  onClick={() => onNavigate(item.href)}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      active
                        ? "bg-teal-700 text-white shadow-sm dark:bg-teal-400 dark:text-slate-950"
                        : "bg-slate-100 text-slate-500 group-hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-teal-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold">{item.label}</span>
                    <span className={`block truncate text-xs ${active ? "text-teal-700 dark:text-teal-300" : "text-slate-500 dark:text-slate-400"}`}>
                      {item.description}
                    </span>
                  </span>
                  {active ? <span className="ml-auto h-6 w-1 rounded-full bg-teal-600 dark:bg-teal-400" /> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <ThemeSelector onChange={onThemeChange} value={themeMode} />

      <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/70 p-3.5 dark:border-teal-400/20 dark:bg-teal-400/[0.07]">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
          <ShieldCheck className="h-5 w-5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
          Control de riesgo
        </div>
        <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
            Riesgo fijo y stop real
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
            Spot, Futures y fees editables
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
            Objetivos de 1:1 a 1:5
          </li>
        </ul>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-teal-700 dark:bg-slate-800 dark:text-teal-300">
            <Code2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Creado por</p>
            <p className="text-xs font-extrabold tracking-wide text-slate-800 dark:text-slate-100">DGBAUTISTA</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-slate-500 dark:text-slate-400">
          Fees VIP 0 verificados el {FEE_VERIFIED_AT}. Confirma siempre el fee real de tu cuenta.
        </p>
      </div>
    </div>
  );
}

export function Sidebar({ themeMode, onThemeChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => window.location.hash.slice(1) || "calculator");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const syncActiveSection = () => setActiveSection(window.location.hash.slice(1) || "calculator");
    window.addEventListener("hashchange", syncActiveSection);
    return () => window.removeEventListener("hashchange", syncActiveSection);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function navigateTo(href: string) {
    setActiveSection(href.slice(1));
    setIsOpen(false);
    if (isOpen) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  function closeMobileMenu() {
    setIsOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  return (
    <>
      <button
        aria-controls="mobile-sidebar"
        aria-expanded={isOpen}
        aria-label="Abrir menú"
        className="fixed right-4 top-4 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-slate-950 text-white shadow-lg transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/20 lg:hidden dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
        onClick={() => setIsOpen(true)}
        ref={menuButtonRef}
        type="button"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        aria-hidden={!isOpen}
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMobileMenu}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <aside
        aria-hidden={!isOpen}
        aria-label="Menú lateral"
        className={`fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-2xl transition-[transform,visibility] duration-300 lg:hidden dark:border-slate-800 dark:bg-slate-900 ${
          isOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
        id="mobile-sidebar"
      >
        <SidebarContent
          activeSection={activeSection}
          onClose={closeMobileMenu}
          onNavigate={navigateTo}
          onThemeChange={onThemeChange}
          themeMode={themeMode}
        />
      </aside>

      <aside className="panel scrollbar-none hidden self-start p-4 lg:sticky lg:top-5 lg:flex lg:h-[calc(100vh-2.5rem)] lg:flex-col lg:overflow-y-auto">
        <SidebarContent
          activeSection={activeSection}
          onNavigate={navigateTo}
          onThemeChange={onThemeChange}
          themeMode={themeMode}
        />
      </aside>
    </>
  );
}
