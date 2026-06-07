import { Copy, Info } from "lucide-react";
import { formatCurrency, formatNumber } from "../../lib/format";
import type { CalculatorResult } from "../../types";
import { EmptyState } from "./EmptyState";
import { Metric } from "./Metric";

type ResultsPanelProps = {
  result: CalculatorResult | null;
  copyLabel: string;
  onCopy: () => void;
};

export function ResultsPanel({ result, copyLabel, onCopy }: ResultsPanelProps) {
  return (
    <section className="panel min-w-0 p-5 sm:p-6" aria-live="polite">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Resultados</p>
          <h2 className="mt-1 text-xl font-extrabold">Resumen de operación</h2>
        </div>
        <button className="icon-btn" disabled={!result} onClick={onCopy} title="Copiar resultado" type="button">
          <Copy className="h-4 w-4" aria-hidden="true" />
          <span>{copyLabel}</span>
        </button>
      </div>

      {!result ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          <div className="grid gap-x-6 border-y border-slate-200 sm:grid-cols-2 dark:border-slate-800">
            <Metric label="Tipo" value={result.side} tone="accent" />
            <Metric label="Size" value={`${formatNumber(result.sizeUnits)} ${result.baseAsset}`} tone="accent" />
            <Metric label="Notional entrada" value={formatCurrency(result.notionalEntry)} />
            {result.market === "futures" ? (
              <Metric label="Margen estimado" value={formatCurrency(result.marginRequired ?? 0)} />
            ) : (
              <Metric label="Notional stop" value={formatCurrency(result.notionalStop)} />
            )}
            <Metric label="Pérdida por precio" value={formatCurrency(result.lossByPrice)} />
            <Metric label="Pérdida total con fees" value={formatCurrency(result.totalLossAtStop)} />
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <FeeCard label="Fee entrada" value={formatCurrency(result.feeOpen)} />
            <FeeCard label="Fee stop" value={formatCurrency(result.feeCloseAtStop)} />
            <FeeCard label="Fees stop" value={formatCurrency(result.feesTotalAtStop)} />
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <Info className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
              Objetivos RR
            </div>
            <div className="overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="muted-soft grid grid-cols-[58px_1fr_1fr] bg-slate-50 px-3 py-2 text-xs font-bold uppercase dark:bg-slate-950 sm:grid-cols-[70px_1fr_1fr_1fr]">
                <span>RR</span>
                <span>TP</span>
                <span className="hidden sm:block">Bruta</span>
                <span>Neta</span>
              </div>
              {result.targets.map((target) => (
                <div
                  className="grid grid-cols-[58px_1fr_1fr] border-t border-slate-200 px-3 py-3 text-sm dark:border-slate-800 sm:grid-cols-[70px_1fr_1fr_1fr]"
                  key={target.rr}
                >
                  <span className="font-bold text-teal-700 dark:text-teal-300">1:{target.rr}</span>
                  <span>{formatNumber(target.price)}</span>
                  <span className="hidden sm:block">{formatCurrency(target.profitGross)}</span>
                  <span className="font-semibold">{formatCurrency(target.profitNet)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FeeCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 p-3 dark:border-slate-800">
      <p className="muted-soft text-xs font-semibold uppercase">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
