import {
  instrumentProfile,
  isInverseQuote,
  isJpyCross,
  type AccountPreference,
  type CfdBroker,
  type InstrumentId,
  type Leverage,
} from "./instruments";
import { quoteDivisor } from "./quoteConversion";

export type CfdInput = {
  broker: CfdBroker;
  instrument: InstrumentId;
  account: AccountPreference;
  direction: "long" | "short";
  risk: number;
  entry: number;
  stop: number;
  tp: number | null;
  spread: number;
  includeSpread: boolean;
  leverage: Leverage;
  contract: number;
  minimum: number;
  step: number;
  usdJpy?: number;
};

export function floorLots(lots: number, step: number) {
  const quotient = lots / step;
  const nearest = Math.round(quotient);
  // Correct only floating-point noise at an exact step boundary.
  const steps =
    Math.abs(quotient - nearest) <=
    Number.EPSILON * Math.max(1, Math.abs(quotient)) * 4
      ? nearest
      : Math.floor(quotient);
  if (!Number.isSafeInteger(steps)) return NaN;
  const [mantissa, exponent = "0"] = step.toString().split("e");
  const decimals = Math.max(
    0,
    (mantissa.split(".")[1]?.length ?? 0) - Number(exponent),
  );
  return decimals <= 100
    ? Number((steps * step).toFixed(decimals))
    : steps * step;
}

export function effectiveLeverage(input: CfdInput, leverage: Leverage) {
  const cap = instrumentProfile(input.broker, input.instrument).leverageCap;
  return cap
    ? leverage === "unlimited"
      ? cap
      : Math.min(leverage, cap)
    : leverage;
}

export function calculateCfd(input: CfdInput) {
  const errors: string[] = [];
  for (const [name, value] of [
    ["Riesgo", input.risk],
    ["Entrada", input.entry],
    ["Stop Loss", input.stop],
    ["Contrato", input.contract],
    ["Lote mínimo", input.minimum],
    ["Paso de lote", input.step],
  ] as const) {
    if (!Number.isFinite(value) || value <= 0)
      errors.push(`${name}: ingresa un número mayor que cero.`);
  }
  if (!Number.isFinite(input.spread) || input.spread < 0)
    errors.push("El spread debe ser cero o positivo.");
  if (input.entry === input.stop)
    errors.push("La entrada y el Stop Loss deben ser diferentes.");
  if (
    input.direction === "long"
      ? input.stop > input.entry
      : input.stop < input.entry
  )
    errors.push(
      input.direction === "long"
        ? "En LONG, el SL debe estar debajo de la entrada."
        : "En SHORT, el SL debe estar encima de la entrada.",
    );
  if (
    input.tp !== null &&
    (!Number.isFinite(input.tp) ||
      input.tp <= 0 ||
      (input.direction === "long"
        ? input.tp <= input.entry
        : input.tp >= input.entry))
  )
    errors.push(
      "El TP debe ser positivo y estar a favor de la dirección elegida.",
    );
  if (
    input.leverage !== "unlimited" &&
    (!Number.isFinite(input.leverage) || input.leverage <= 0)
  )
    errors.push("Apalancamiento no válido.");
  if (input.leverage === "unlimited" && input.broker === "Vantage")
    errors.push(
      "1:UNLIMITED no está habilitado en este perfil de Vantage. Selecciona un apalancamiento de tu cuenta.",
    );
  if (errors.length) return { ok: false as const, errors };

  if (
    isJpyCross(input.instrument) &&
    (!Number.isFinite(input.usdJpy) || Number(input.usdJpy) <= 0)
  )
    return {
      ok: false as const,
      errors: [
        "Falta USDJPY de referencia para convertir a USD. Ingresa la tasa en el formulario o escribe: conversión USDJPY 150.",
      ],
    };

  const profile = instrumentProfile(input.broker, input.instrument);
  const distance = Math.abs(input.entry - input.stop);
  const stopPerUnit = distance / quoteDivisor(input, input.stop);
  const spreadPerUnit = input.spread / quoteDivisor(input, input.entry);
  const unitRisk = stopPerUnit + (input.includeSpread ? spreadPerUnit : 0);
  const units = input.risk / unitRisk;
  const pureUnits = input.risk / stopPerUnit;
  const profitPerUnit =
    input.tp === null
      ? null
      : Math.abs(input.tp - input.entry) / quoteDivisor(input, input.tp);

  function account(kind: "standard" | "cent") {
    const contract = input.contract / (kind === "cent" ? 100 : 1);
    const exactLots = units / contract;
    const lots = floorLots(exactLots, input.step);
    const available = kind === "standard" || profile.centAvailable;
    const viable = available && lots >= input.minimum;
    const realUnits = lots * contract;
    const stopRisk = realUnits * stopPerUnit;
    const spreadCost = realUnits * spreadPerUnit;
    const totalRisk = stopRisk + spreadCost;
    const profit =
      profitPerUnit === null ? null : realUnits * profitPerUnit - spreadCost;
    const notional = isInverseQuote(input.instrument)
      ? realUnits
      : (realUnits * input.entry) / quoteDivisor(input, input.entry);
    const leverage = effectiveLeverage(input, input.leverage);
    return {
      kind,
      available,
      viable,
      contract,
      exactLots,
      lots,
      realUnits,
      stopRisk,
      spreadCost,
      totalRisk,
      profit,
      notional,
      rr: profit === null || totalRisk === 0 ? null : profit / totalRisk,
      minimumRisk: input.minimum * contract * (stopPerUnit + spreadPerUnit),
      margin: leverage === "unlimited" ? 0 : notional / leverage,
      leverage,
    };
  }
  const standard = account("standard");
  const cent = account("cent");
  const selected =
    input.account === "standard"
      ? standard
      : input.account === "cent"
        ? cent
        : standard.viable
          ? standard
          : cent.viable
            ? cent
            : null;
  const spreadPercent = (input.spread / distance) * 100;
  const values = [
    distance,
    unitRisk,
    units,
    pureUnits,
    spreadPercent,
    ...[standard, cent].flatMap((a) => [
      a.exactLots,
      a.lots,
      a.realUnits,
      a.totalRisk,
      a.notional,
      a.margin,
      a.minimumRisk,
      a.profit ?? 0,
      a.rr ?? 0,
    ]),
  ];
  if (values.some((value) => !Number.isFinite(value)) || unitRisk <= 0)
    return {
      ok: false as const,
      errors: [
        "Los valores exceden el rango de cálculo. Revisa las magnitudes ingresadas.",
      ],
    };
  return {
    ok: true as const,
    errors: [],
    units,
    pureUnits,
    distance,
    standard,
    cent,
    selected: selected?.viable ? selected : null,
    spreadPercent,
  };
}

export type CfdResult = Extract<ReturnType<typeof calculateCfd>, { ok: true }>;
