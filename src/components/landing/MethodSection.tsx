import { VALUE_PROPS, METHOD_STEPS } from "../../content/landing";

export function MethodSection() {
  return (
    <>
      <section className="border-y border-slate-200/80 bg-white py-20 dark:border-white/10 dark:bg-slate-900/40 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">Decisiones con contexto</p>
            <h2 className="section-title text-left">Todo lo importante antes de presionar “Comprar”</h2>
            <p className="section-copy text-left">
              Una buena entrada no compensa una mala gestión. Risk Control reúne las variables que suelen quedar dispersas.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {VALUE_PROPS.map((item) => {
              const Icon = item.icon;
              return (
                <article className="group rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:shadow-panel dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-teal-400/30 dark:hover:bg-slate-900" key={item.title}>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-teal-300 dark:bg-teal-400 dark:text-slate-950">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-black leading-tight tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="scroll-mt-20 py-20 sm:py-24" id="metodo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="section-kicker">Método simple</p>
              <h2 className="section-title text-left">Tres decisiones. Un plan mucho más claro.</h2>
              <p className="section-copy text-left">
                La calculadora no predice el mercado. Te ayuda a definir qué harás si tu hipótesis funciona y cuánto perderás si no.
              </p>
              <a className="btn-primary mt-7" href="#herramienta">Probar la calculadora</a>
            </div>

            <div className="space-y-4">
              {METHOD_STEPS.map((step) => (
                <article className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:grid-cols-[72px_1fr] sm:p-7" key={step.number}>
                  <span className="text-4xl font-black tracking-[-0.05em] text-teal-600/35 dark:text-teal-300/40">{step.number}</span>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
