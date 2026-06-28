import { BarChart3 } from "lucide-react";

export function PageHeader() {
  return (
    <section className="panel relative min-w-0 overflow-hidden border-slate-900 bg-slate-950 p-5 text-white sm:p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-64 bg-sky-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">
            Calculadora operativa
          </p>
          <h2 className="mt-1.5 max-w-full break-words text-2xl font-extrabold tracking-tight sm:text-[2rem]">
            Size, fees y objetivos por riesgo
          </h2>
          <p className="mt-2 text-sm text-slate-300">Planifica la operación antes de entrar al mercado.</p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold text-slate-100 backdrop-blur">
          <BarChart3 className="h-4 w-4 text-teal-300" aria-hidden="true" />
          RR 1:1 - 1:5
        </div>
      </div>
    </section>
  );
}
