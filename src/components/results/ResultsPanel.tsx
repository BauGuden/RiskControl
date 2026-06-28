import { Copy, Info, Share2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { formatCurrency, formatNumber } from "../../lib/format";
import type { CalculatorResult } from "../../types";
import { Metric } from "./Metric";

type ResultsPanelProps = {
  result: CalculatorResult;
  copyLabel: string;
  shareLabel: string;
  onCopy: () => void;
  onShare: () => void;
  onClose: () => void;
};

export function ResultsPanel({
  result,
  copyLabel,
  shareLabel,
  onCopy,
  onShare,
  onClose
}: ResultsPanelProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const sideTone = result.side === "Short" ? "danger" : "accent";
  const sideTextClass =
    result.side === "Short" ? "text-red-700 dark:text-red-300" : "text-teal-700 dark:text-teal-300";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-2 sm:items-center sm:p-6">
      <button
        aria-label="Cerrar resultados"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <section
        aria-labelledby="results-title"
        aria-modal="true"
        className="panel relative z-10 flex max-h-[calc(100dvh-1rem)] min-h-0 w-full max-w-3xl flex-col overflow-hidden shadow-2xl focus:outline-none sm:max-h-[calc(100dvh-3rem)]"
        id="results"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex shrink-0 flex-col items-stretch gap-3 border-b border-slate-100 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              Resultado calculado
            </p>
            <h2 className="mt-1 break-words text-lg font-extrabold leading-6 tracking-tight" id="results-title">
              {result.symbol} · Resumen de operación
            </h2>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            <button
              aria-label={copyLabel}
              className="icon-btn flex-1 sm:flex-none"
              onClick={onCopy}
              title="Copiar resultado"
              type="button"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span>{copyLabel}</span>
            </button>
            <button
              aria-label={shareLabel}
              className="icon-btn flex-1 sm:flex-none"
              onClick={onShare}
              title="Compartir resultado"
              type="button"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>{shareLabel}</span>
            </button>
            <button
              aria-label="Cerrar resultados"
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-teal-700/15 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="scrollbar-none min-h-0 touch-pan-y overscroll-contain overflow-y-auto px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 [-webkit-overflow-scrolling:touch] sm:p-6">
          <div className="space-y-5">
            <div className="grid gap-x-6 rounded-2xl bg-slate-50 px-4 sm:grid-cols-2 dark:bg-slate-950/60">
              <Metric label="Tipo" value={result.side} tone={sideTone} />
              <Metric label="Size" value={`${formatNumber(result.sizeUnits)} ${result.baseAsset}`} tone={sideTone} />
              <Metric label="Break even" value={formatNumber(result.breakEvenPrice)} tone={sideTone} />
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
              <FeeCard label="Total fee" value={formatCurrency(result.feesTotalAtStop)} />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <Info className={`h-4 w-4 ${sideTextClass}`} aria-hidden="true" />
                Objetivos RR
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
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
                    <span className={`font-bold ${sideTextClass}`}>1:{target.rr}</span>
                    <span>{formatNumber(target.price)}</span>
                    <span className="hidden sm:block">{formatCurrency(target.profitGross)}</span>
                    <span className="font-semibold">{formatCurrency(target.profitNet)}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="muted-soft border-t border-slate-200 pt-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] dark:border-slate-800">
              Made by DGBAUTISTA
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeeCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="muted-soft text-xs font-semibold uppercase">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
