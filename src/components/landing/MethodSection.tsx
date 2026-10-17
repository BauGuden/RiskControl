import {
  ArrowUpRight,
  Check,
  Layers3,
  ShieldCheck,
  Target,
} from "lucide-react";
import { METHOD_STEPS } from "../../content/landing";

export function MethodSection() {
  return (
    <section className="method-section scroll-mt-24" id="metodo">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">02 / UN MÉTODO REPETIBLE</p>
            <h2 className="section-title text-left">
              Menos improvisación.
              <br />
              Más claridad en cada entrada.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 muted">
            La calculadora conecta tu invalidación, el presupuesto de pérdida y
            tus objetivos en un mismo plan.
          </p>
        </div>
        <div className="method-grid">
          {METHOD_STEPS.map((step, index) => {
            const Icon = [ShieldCheck, Layers3, Target][index];
            return (
              <article key={step.number} className="method-card">
                <div className="flex items-center justify-between">
                  <span className="feature-icon">
                    <Icon size={20} />
                  </span>
                  <span className="font-mono text-xs muted">
                    / {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 muted">
                  {step.description}
                </p>
                <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
                  <Check size={14} />
                  {
                    [
                      "Entrada y SL definidos",
                      "Tamaño y costes visibles",
                      "Salida y exposición calculadas",
                    ][index]
                  }
                </p>
              </article>
            );
          })}
        </div>
        <a
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300"
          href="#herramienta"
        >
          Llevarlo a mi operación <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
