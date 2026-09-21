import { AlertTriangle, ArrowRight } from "lucide-react";
import { FEE_PRESETS, FEE_VERIFIED_AT } from "../../data/fees";
import type { Broker } from "../../types";

const brokers: Array<Exclude<Broker, "CUSTOM">> = ["BINANCE", "BYBIT", "MEXC", "BITGET", "BITUNIX"];

export function FeesSection() {
  return (
    <section className="scroll-mt-20 bg-slate-950 py-20 text-white sm:py-24" id="comisiones">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker text-teal-300">Comisiones transparentes</p>
            <h2 className="section-title text-left text-white">El fee pequeño que cambia el resultado grande</h2>
            <p className="section-copy text-left text-slate-300">
              Referencias base para comparar escenarios. En la herramienta puedes elegir promociones, descuentos y rutas especiales.
            </p>
          </div>
          <a className="inline-flex items-center gap-2 text-sm font-black text-teal-300 hover:text-teal-200" href="#herramienta">
            Comparar en la calculadora <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="hidden grid-cols-[1.2fr_repeat(4,1fr)] border-b border-white/10 px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 md:grid">
            <span>Exchange</span><span>Spot maker</span><span>Spot taker</span><span>Futuros maker</span><span>Futuros taker</span>
          </div>
          {brokers.map((broker) => {
            const preset = FEE_PRESETS[broker];
            return (
              <div className="grid gap-4 border-b border-white/10 px-5 py-5 last:border-0 md:grid-cols-[1.2fr_repeat(4,1fr)] md:items-center md:px-6" key={broker}>
                <div>
                  <p className="font-black">{preset.label}</p>
                  {broker === "MEXC" ? <p className="mt-1 text-[10px] text-amber-300">Base fuera de promociones</p> : null}
                </div>
                <FeeValue label="Spot maker" value={preset.spot.maker} />
                <FeeValue label="Spot taker" value={preset.spot.taker} />
                <FeeValue label="Futuros maker" value={preset.futures.maker} />
                <FeeValue label="Futuros taker" value={preset.futures.taker} />
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-xs leading-5 text-slate-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p>
            Verificado el {FEE_VERIFIED_AT}. MEXC Futures API utiliza una tarifa separada de 0.060% maker / 0.080% taker. Funding, spread y slippage no están incluidos.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeeValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 md:block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 md:hidden">{label}</span>
      <span className="font-mono text-sm font-bold text-slate-100">{value.toFixed(3)}%</span>
    </div>
  );
}
