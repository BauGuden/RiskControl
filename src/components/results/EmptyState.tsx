import { Calculator } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-6 text-center dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-400/20">
        <Calculator className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">Todo listo para calcular</p>
      <p className="muted-soft mt-2 max-w-xs text-sm leading-6">
        Ingresa precio, stop y riesgo para ver size, notional, fees, margen y objetivos.
      </p>
    </div>
  );
}
