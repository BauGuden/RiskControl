import { Calculator } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">
      <Calculator className="h-9 w-9 text-slate-400 dark:text-slate-500" aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Listo para calcular</p>
      <p className="muted-soft mt-2 max-w-sm text-sm">
        Ingresa precio, stop y riesgo para ver size, notional, fees, margen y objetivos.
      </p>
    </div>
  );
}
