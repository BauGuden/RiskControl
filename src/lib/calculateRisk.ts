import type { CalculatorInput, CalculatorResult, Side, ValidationError } from "../types";

export function detectSide(entry: number, stop: number): Side | null {
  if (!Number.isFinite(entry) || !Number.isFinite(stop)) return null;
  if (stop < entry) return "Long";
  if (stop > entry) return "Short";
  return null;
}

export function getBaseAsset(symbol: string): string {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) return "moneda";
  return normalized
    .replace(/[-_/]?USDT$/, "")
    .replace(/[-_/]?USDC$/, "")
    .replace(/[-_/]?USD$/, "") || normalized;
}

export function getTargetPrice(entry: number, distance: number, rr: number, side: Side): number {
  return side === "Long" ? entry + distance * rr : entry - distance * rr;
}

export function getBreakEvenPrice(entry: number, feeInRate: number, feeOutRate: number, side: Side): number {
  return side === "Long"
    ? (entry * (1 + feeInRate)) / (1 - feeOutRate)
    : (entry * (1 - feeInRate)) / (1 + feeOutRate);
}

export function validateInput(input: CalculatorInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Number.isFinite(input.entry) || input.entry <= 0) {
    errors.push({ field: "entry", message: "Ingresa un precio de entrada mayor a 0." });
  }

  if (!Number.isFinite(input.stop) || input.stop <= 0) {
    errors.push({ field: "stop", message: "Ingresa un stop loss mayor a 0." });
  }

  if (!Number.isFinite(input.risk) || input.risk <= 0) {
    errors.push({ field: "risk", message: "Ingresa un riesgo en USDT mayor a 0." });
  }

  if (!Number.isFinite(input.feeInPct) || input.feeInPct < 0) {
    errors.push({ field: "feeInPct", message: "El fee de entrada no puede ser negativo." });
  }

  if (!Number.isFinite(input.feeOutPct) || input.feeOutPct < 0) {
    errors.push({ field: "feeOutPct", message: "El fee de salida no puede ser negativo." });
  }

  if (Number.isFinite(input.entry) && Number.isFinite(input.stop) && input.entry === input.stop) {
    errors.push({ field: "stop", message: "El stop debe ser diferente al precio de entrada." });
  }

  if (input.market === "futures" && (!Number.isFinite(input.leverage) || Number(input.leverage) <= 0)) {
    errors.push({ field: "leverage", message: "El leverage debe ser mayor a 0." });
  }

  return errors;
}

export function calculateRisk(input: CalculatorInput): CalculatorResult {
  const errors = validateInput(input);
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join(" "));
  }

  const side = detectSide(input.entry, input.stop);
  if (!side) {
    throw new Error("No se pudo detectar Long o Short con los precios indicados.");
  }

  const symbol = input.symbol.trim().toUpperCase() || "N/A";
  const distance = Math.abs(input.entry - input.stop);
  const feeInRate = input.feeInPct / 100;
  const feeOutRate = input.feeOutPct / 100;
  const feeCostAtStopPerUnit = input.entry * feeInRate + input.stop * feeOutRate;
  const denominator = input.includeFeesInRisk ? distance + feeCostAtStopPerUnit : distance;
  const sizeUnits = input.risk / denominator;
  const notionalEntry = sizeUnits * input.entry;
  const notionalStop = sizeUnits * input.stop;
  const breakEvenPrice = getBreakEvenPrice(input.entry, feeInRate, feeOutRate, side);
  const feeOpen = notionalEntry * feeInRate;
  const feeCloseAtStop = notionalStop * feeOutRate;
  const feesTotalAtStop = feeOpen + feeCloseAtStop;
  const lossByPrice = sizeUnits * distance;
  const totalLossAtStop = lossByPrice + feesTotalAtStop;

  const targets = Array.from({ length: 5 }, (_, index) => {
    const rr = index + 1;
    const price = getTargetPrice(input.entry, distance, rr, side);
    const profitGross = sizeUnits * distance * rr;
    const feeCloseAtTarget = sizeUnits * price * feeOutRate;
    const profitNet = profitGross - feeOpen - feeCloseAtTarget;

    return {
      rr,
      price,
      profitGross,
      feeCloseAtTarget,
      profitNet
    };
  });

  return {
    symbol,
    market: input.market,
    broker: input.broker,
    side,
    entryPrice: input.entry,
    stopPrice: input.stop,
    riskBudget: input.risk,
    includeFeesInRisk: input.includeFeesInRisk,
    distance,
    sizeUnits,
    baseAsset: getBaseAsset(symbol),
    notionalEntry,
    notionalStop,
    marginRequired:
      input.market === "futures" && input.leverage ? notionalEntry / input.leverage : undefined,
    breakEvenPrice,
    feeOpen,
    feeCloseAtStop,
    feesTotalAtStop,
    lossByPrice,
    totalLossAtStop,
    targets
  };
}
