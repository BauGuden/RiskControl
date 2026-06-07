import type { Broker, CalculatorInput, Market, OrderRole } from "../../types";

export type CalculatorFormState = {
  symbol: string;
  market: Market;
  broker: Broker;
  entry: string;
  stop: string;
  risk: string;
  entryRole: OrderRole;
  exitRole: OrderRole;
  feeInPct: string;
  feeOutPct: string;
  includeFeesInRisk: boolean;
  leverage: string;
};

export const initialCalculatorForm: CalculatorFormState = {
  symbol: "BTCUSDT",
  market: "futures",
  broker: "BINANCE",
  entry: "",
  stop: "",
  risk: "",
  entryRole: "taker",
  exitRole: "taker",
  feeInPct: "0.05",
  feeOutPct: "0.05",
  includeFeesInRisk: true,
  leverage: "10"
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function toCalculatorInput(form: CalculatorFormState): CalculatorInput {
  return {
    symbol: form.symbol,
    market: form.market,
    broker: form.broker,
    entry: toNumber(form.entry),
    stop: toNumber(form.stop),
    risk: toNumber(form.risk),
    feeInPct: toNumber(form.feeInPct),
    feeOutPct: toNumber(form.feeOutPct),
    includeFeesInRisk: form.includeFeesInRisk,
    leverage: form.market === "futures" ? toNumber(form.leverage) : undefined
  };
}
