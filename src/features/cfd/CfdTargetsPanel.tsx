import { ArrowUpRight, Check, Crosshair, Target } from "lucide-react";
import type { CfdInput, CfdResult } from "./calculateCfd";
import { getCfdTargets, type CfdTargetRatio } from "./cfdTargets";

const price = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 8 });
const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

export function CfdTargetsPanel({
  input,
  result,
  selectedRatio,
  onSelect,
}: {
  input: CfdInput;
  result: CfdResult;
  selectedRatio: CfdTargetRatio | null;
  onSelect: (ratio: CfdTargetRatio) => void;
}) {
  const targets = getCfdTargets(input);
  const account = result.selected;
  return (
    <section
      className="panel target-panel"
      aria-label="Objetivos Take Profit CFD"
    >
      <div className="target-panel-heading">
        <div className="flex items-center gap-3">
          <span className="feature-icon">
            <Target size={20} />
          </span>
          <div>
            <p className="section-kicker">ELIGE TU OBJETIVO</p>
            <h3 className="mt-1 text-lg font-extrabold tracking-tight">
              Tu salida, calculada.
            </h3>
          </div>
        </div>
        <span className="terminal-badge">TP 1:2 → 1:10</span>
      </div>
      <p className="mb-5 mt-3 text-xs leading-5 muted">
        Los nueve TP se actualizan al instante. Cada ratio compara beneficio
        neto con riesgo total al SL, incluido el spread.
      </p>
      <div
        className="target-grid"
        role="group"
        aria-label="Ratios de Take Profit"
      >
        {targets.map((target) => {
          const active = selectedRatio === target.ratio;
          const profit =
            account && target.netPerUnit !== null
              ? target.netPerUnit * account.realUnits
              : null;
          return (
            <button
              key={target.ratio}
              type="button"
              aria-label={`Seleccionar TP 1:${target.ratio}`}
              aria-pressed={active}
              disabled={target.price === null}
              className={`target-card ${active ? "target-card-active" : ""}`}
              onClick={() => onSelect(target.ratio)}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="target-ratio">1:{target.ratio}</span>
                {active ? (
                  <Check size={14} />
                ) : (
                  <ArrowUpRight size={14} className="opacity-40" />
                )}
              </span>
              <span className="mt-3 block text-[9px] font-bold uppercase tracking-widest muted">
                Precio TP
              </span>
              <span className="target-price">
                {target.price === null ? "No alcanzable" : price(target.price)}
              </span>
              <span className="target-profit">
                {profit === null
                  ? "Sin volumen ejecutable"
                  : `+${money(profit)}`}
              </span>
              {account?.kind === "cent" && profit !== null && (
                <span className="mt-0.5 block text-[10px] muted">
                  {price(profit * 100)} USC
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!account && (
        <p className="mt-4 text-xs leading-5 muted">
          Los precios son teóricos. Las ganancias aparecerán cuando la cuenta
          permita un volumen ejecutable.
        </p>
      )}
      <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 muted">
        <Crosshair size={13} className="mt-1 shrink-0" />
        Cada tarjeta representa una salida alternativa de la posición completa.
        No son cierres parciales ni ganancias acumuladas.
      </p>
    </section>
  );
}

export function CfdTradeMap({ input }: { input: CfdInput }) {
  if (input.tp === null || !Number.isFinite(input.tp)) return null;
  const low = Math.min(input.stop, input.tp);
  const high = Math.max(input.stop, input.tp);
  if (!(high > low)) return null;
  const x = (value: number) => 20 + ((value - low) / (high - low)) * 560;
  const entry = x(input.entry),
    stop = x(input.stop),
    tp = x(input.tp);
  return (
    <div className="trade-map">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest muted">
          Mapa de la operación
        </p>
        <span className="text-[10px] font-semibold muted">
          {input.direction === "long" ? "LONG ↗" : "SHORT ↘"}
        </span>
      </div>
      <svg
        viewBox="0 0 600 60"
        className="h-16 w-full"
        role="img"
        aria-label={`Stop Loss ${price(input.stop)}, entrada ${price(input.entry)}, Take Profit ${price(input.tp)}`}
      >
        <line
          x1="20"
          y1="30"
          x2="580"
          y2="30"
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
        />
        <rect
          x={Math.min(stop, entry)}
          y="18"
          width={Math.abs(stop - entry)}
          height="24"
          rx="4"
          fill="#f43f5e"
          fillOpacity="0.2"
        />
        <rect
          x={Math.min(entry, tp)}
          y="18"
          width={Math.abs(entry - tp)}
          height="24"
          rx="4"
          fill="#14b8a6"
          fillOpacity="0.2"
        />
        {[
          { x: stop, color: "#f43f5e" },
          { x: entry, color: "#94a3b8" },
          { x: tp, color: "#14b8a6" },
        ].map((point, i) => (
          <g key={i}>
            <line
              x1={point.x}
              x2={point.x}
              y1="10"
              y2="50"
              stroke={point.color}
              strokeWidth="2"
            />
            <circle cx={point.x} cy="30" r="4" fill={point.color} />
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[10px] font-bold text-rose-600 dark:text-rose-300">
            STOP LOSS
          </p>
          <p className="mt-1 break-all font-mono font-semibold">
            {price(input.stop)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold muted">ENTRADA</p>
          <p className="mt-1 break-all font-mono font-semibold">
            {price(input.entry)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300">
            TAKE PROFIT
          </p>
          <p className="mt-1 break-all font-mono font-semibold">
            {price(input.tp)}
          </p>
        </div>
      </div>
    </div>
  );
}
