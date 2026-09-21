import { ArrowRight, Bot, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { EXCHANGES } from "../../content/landing";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" id="inicio">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-[8%] top-16 h-72 w-72 rounded-full bg-teal-400/15 blur-[110px]" />
      <div className="pointer-events-none absolute right-[5%] top-28 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-extrabold text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Riesgo primero. Ejecución después.
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-6xl lg:text-[4.6rem]">
            Opera con un plan,
            <span className="block bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent dark:from-teal-300 dark:to-sky-300">
              no con impulsos.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Calcula tamaño, pérdida máxima, fees, margen y objetivos netos antes de abrir una posición Spot o Futures.
            Una herramienta clara para convertir tu análisis en una decisión medible.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary h-12 px-6 text-base" href="#herramienta">
              Calcular mi operación
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a className="btn-secondary h-12 px-6 text-base" href="#metodo">
              Ver cómo funciona
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            {["Sin registro", "Cálculo local", "Spot y Futures"].map((item) => (
              <span className="flex items-center gap-1.5" key={item}>
                <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-300" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-teal-400/20 via-transparent to-sky-400/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur dark:border-white/10 dark:bg-slate-900/85 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                  Plan de operación
                </p>
                <p className="mt-1 text-lg font-black">BTCUSDT · Long</p>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                Riesgo controlado
              </span>
            </div>

            <div className="relative mt-5 h-48 overflow-hidden rounded-2xl bg-slate-950 p-4">
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
              <div className="absolute inset-y-0 left-1/3 border-l border-dashed border-white/10" />
              <div className="absolute inset-y-0 left-2/3 border-l border-dashed border-white/10" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 190" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 155 C45 145 66 158 104 128 S168 124 206 103 S267 116 306 75 S370 92 412 48 S466 43 500 20 L500 190 L0 190 Z" fill="url(#chartFill)" />
                <path d="M0 155 C45 145 66 158 104 128 S168 124 206 103 S267 116 306 75 S370 92 412 48 S466 43 500 20" fill="none" stroke="#2dd4bf" strokeWidth="3" />
              </svg>
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Escenario planificado</span>
                  <span className="flex items-center gap-1 text-teal-300"><TrendingUp className="h-3 w-3" /> RR 1:3</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Entrada</p>
                    <p className="mt-0.5 font-black text-white">61,800.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Objetivo neto</p>
                    <p className="mt-0.5 font-black text-teal-300">+23.31 USDT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <PreviewMetric label="Riesgo" value="$8.00" icon={<ShieldCheck className="h-4 w-4" />} />
              <PreviewMetric label="Size" value="0.017 BTC" icon={<TrendingUp className="h-4 w-4" />} />
              <PreviewMetric label="Asistente" value="Gemini" icon={<Bot className="h-4 w-4" />} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl border-y border-slate-200/80 px-4 py-5 dark:border-white/10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-left">
            Perfiles de fees para
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {EXCHANGES.map((exchange) => (
              <span className="text-sm font-black tracking-tight text-slate-500 dark:text-slate-300" key={exchange}>
                {exchange}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewMetric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-slate-950/60">
      <div className="text-teal-600 dark:text-teal-300">{icon}</div>
      <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-xs font-black sm:text-sm">{value}</p>
    </div>
  );
}
