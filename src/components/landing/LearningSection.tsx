import { ArrowUpRight } from "lucide-react";
import { CONTENT_PILLARS } from "../../content/landing";

export function LearningSection() {
  return (
    <section className="scroll-mt-20 py-20 sm:py-24" id="aprende">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Contenido que mejora decisiones</p>
          <h2 className="section-title">Aprende lo que realmente mueve tu resultado</h2>
          <p className="section-copy">
            Conceptos prácticos para conectar análisis, ejecución y gestión de capital sin ruido innecesario.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {CONTENT_PILLARS.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="group flex min-h-72 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-panel dark:border-white/10 dark:bg-slate-900" key={item.title}>
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300 dark:text-slate-600">0{index + 1}</span>
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">{item.category}</p>
                <h3 className="mt-2 text-xl font-black leading-tight tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-black text-slate-400">
                  Guía en preparación <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </article>
            );
          })}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 to-cyan-700 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-100">Antes de tu próxima entrada</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Haz el cálculo. Define el riesgo. Respeta el plan.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-teal-50/90 sm:text-base">
              El mercado seguirá siendo incierto. Tu exposición no tiene por qué serlo.
            </p>
            <a className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-black text-teal-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50" href="#herramienta">
              Abrir calculadora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
