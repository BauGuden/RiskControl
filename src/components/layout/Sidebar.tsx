import { ShieldCheck, SlidersHorizontal, TrendingUp } from "lucide-react";
import { FEE_VERIFIED_AT } from "../../data/fees";
import { ThemeSelector } from "../../features/theme/ThemeSelector";
import type { ThemeMode } from "../../features/theme/theme";

type SidebarProps = {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
};

export function Sidebar({ themeMode, onThemeChange }: SidebarProps) {
  return (
    <aside className="panel min-w-0 p-5 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center bg-slate-950 text-sm font-black text-white dark:bg-teal-500 dark:text-slate-950">
          RC
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Risk Control</p>
          <h1 className="break-words text-xl font-extrabold">DGBM Calculator</h1>
        </div>
      </div>

      <ThemeSelector onChange={onThemeChange} value={themeMode} />

      <div className="muted mt-8 space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
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
    </aside>
  );
}
