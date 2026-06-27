import { BarChart3 } from "lucide-react";

export function PageHeader() {
  return (
    <section className="panel min-w-0 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Calculadora operativa dgbautista</p>
          <h2 className="mt-1 max-w-full break-words text-2xl font-extrabold sm:text-3xl">
            Size, fees y objetivos por riesgo
          </h2>
        </div>
        <div className="muted flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-slate-800 dark:bg-slate-950">
          <BarChart3 className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
          RR 1:1 - 1:5
        </div>
      </div>
    </section>
  );
}
