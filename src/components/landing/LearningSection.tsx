import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";

const concepts = [
  {
    number: "01",
    category: "GESTIÓN DE RIESGO",
    title: "Riesgo, margen y exposición: tres números distintos",
    text: "El riesgo al SL depende de la distancia al stop y del tamaño de la posición. La exposición es el valor nocional que controlas. El margen es la parte retenida para sostenerla: al cambiar el apalancamiento, cambia ese margen. Con el mismo tamaño y SL, la pérdida estimada se mantiene. El deslizamiento puede aumentar la pérdida real.",
  },
  {
    number: "02",
    category: "OBJETIVOS CFD",
    title: "Qué significa realmente un objetivo 1:3",
    text: "Un ratio riesgo/beneficio 1:3 busca ganar tres veces lo que se arriesga. En la calculadora CFD se usa el riesgo total estimado, incluido el spread. Si el riesgo real después del redondeo es $0.80, el objetivo neto 1:3 es $2.40. Los nueve TP son salidas alternativas para toda la posición; sus ganancias no se suman.",
  },
  {
    number: "03",
    category: "EJECUCIÓN",
    title: "El spread también forma parte de tu operación",
    text: "El spread es la diferencia entre precio de compra y venta. Puedes reservarlo dentro de tu presupuesto de riesgo o sumarlo como un coste adicional. Las comisiones, el funding, el swap y el deslizamiento son conceptos separados. Si tus precios de ejecución ya incluyen el spread, ajusta la estimación para no contarlo dos veces.",
  },
];

export function LearningSection() {
  return (
    <section className="scroll-mt-24" id="aprende">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">04 / CONCEPTOS CLAVE</p>
            <h2 className="section-title text-left">
              Entiende los números.
              <br />
              Decide con contexto.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 muted">
              Una lectura breve para interpretar el resultado de tu próxima
              operación.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold muted">
              <BookOpen size={15} /> Conceptos de la calculadora
            </span>
          </div>
          <div className="learning-list">
            {concepts.map((concept) => (
              <details key={concept.number} className="learning-item">
                <summary>
                  <span className="font-mono text-xs muted">
                    {concept.number}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[9px] font-bold tracking-widest text-teal-700 dark:text-teal-300">
                      {concept.category}
                    </span>
                    <span className="mt-2 block text-base font-bold leading-6 tracking-tight">
                      {concept.title}
                    </span>
                  </span>
                  <ChevronDown size={17} className="shrink-0 muted" />
                </summary>
                <p className="px-5 pb-6 text-sm leading-7 muted sm:pl-16">
                  {concept.text}
                </p>
              </details>
            ))}
          </div>
        </div>
        <div className="closing-banner">
          <div>
            <p className="section-kicker">TU PRÓXIMA OPERACIÓN EMPIEZA AQUÍ</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Un plan claro antes del primer clic.
            </h2>
          </div>
          <a className="btn-primary h-12 shrink-0 px-6" href="#herramienta">
            Calcular mi operación <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
