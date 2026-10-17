import { ArrowRight, ArrowUpRight, Crosshair, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-section" id="inicio">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div>
          <div className="hero-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> TU VENTAJA
            EMPIEZA CON UN PLAN
          </div>
          <h1 className="hero-title">
            El mercado cambia.
            <br />
            <span>Tu riesgo lo defines tú.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 muted sm:text-base">
            Convierte una idea en una operación medible. Calcula lotes, compara
            cuentas y encuentra tus salidas antes de entrar.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="btn-primary h-12 px-6" href="#herramienta">
              Abrir calculadora <ArrowRight size={16} />
            </a>
            <a className="hero-secondary" href="#metodo">
              Conoce el método <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="hero-capabilities">
            <span>
              <ShieldCheck size={14} /> Cálculos locales
            </span>
            <span>
              <Crosshair size={14} /> TP automáticos en CFD
            </span>
            <span>Sin registro</span>
          </div>
        </div>
        <div className="hero-terminal">
          <div className="terminal-topbar">
            <div className="flex gap-1.5">
              <i />
              <i />
              <i />
            </div>
            <span>RISK CONTROL / VISTA DE EJEMPLO</span>
            <ShieldCheck size={14} />
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest muted">
                  PLAN DE OPERACIÓN
                </p>
                <p className="mt-1 text-xl font-extrabold tracking-tight">
                  XAUUSD{" "}
                  <span className="ml-1 text-xs font-medium muted">
                    Oro / USD
                  </span>
                </p>
              </div>
              <span className="long-badge">↗ LONG</span>
            </div>
            <div className="hero-levels">
              <div>
                <span>STOP LOSS</span>
                <strong>4,080.00</strong>
              </div>
              <div>
                <span>ENTRADA</span>
                <strong>4,100.00</strong>
              </div>
              <div>
                <span>TP NETO 1:2</span>
                <strong>4,140.60</strong>
              </div>
            </div>
            <div className="hero-position-bar">
              <div>RIESGO</div>
              <div>
                BENEFICIO 2R <ArrowRight size={13} />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider muted">
                  Lotes Cent
                </p>
                <p className="mt-2 font-mono text-lg font-semibold">0.05</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider muted">
                  Riesgo total
                </p>
                <p className="mt-2 font-mono text-lg font-semibold">$1.01</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider muted">
                  Beneficio neto
                </p>
                <p className="mt-2 font-mono text-lg font-semibold text-teal-700 dark:text-teal-300">
                  +$2.02
                </p>
              </div>
            </div>
            <div className="hero-target-preview">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((ratio) => (
                <span className={ratio === 2 ? "active" : ""} key={ratio}>
                  1:{ratio}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-5 muted">
              Ejemplo ilustrativo · riesgo SL $1 + spread $0.01. Los precios no
              son cotizaciones en vivo.
            </p>
          </div>
        </div>
      </div>
      <div className="market-strip">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 sm:px-6 lg:px-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] muted">
            UN ESPACIO. TODOS TUS MERCADOS.
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold">
            <span>
              BTC <small>Cripto</small>
            </span>
            <span>
              XAU <small>Metales</small>
            </span>
            <span>
              FX <small>Divisas</small>
            </span>
            <span>
              NAS <small>Índices</small>
            </span>
          </div>
          <span className="text-[10px] font-mono muted">
            EXNESS / VANTAGE / EXCHANGES
          </span>
        </div>
      </div>
    </section>
  );
}
