import type { CfdInput } from "./calculateCfd";
import { isInverseQuote, isJpyCross } from "./instruments";
import { quoteDivisor } from "./quoteConversion";

export const CFD_TARGET_RATIOS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type CfdTargetRatio = (typeof CFD_TARGET_RATIOS)[number];
export type CfdTarget = {
  ratio: CfdTargetRatio;
  price: number | null;
  netPerUnit: number | null;
};

// Solve net profit per unit = ratio * (SL loss per unit + spread per unit).
// JPY profit is converted at the exit price, so its price equation is nonlinear.
export function getCfdTargets(
  input: Pick<
    CfdInput,
    "entry" | "stop" | "direction" | "spread" | "instrument" | "usdJpy"
  >,
): CfdTarget[] {
  const { entry, stop, direction, spread, instrument } = input;
  const valid =
    [entry, stop, spread].every(Number.isFinite) &&
    entry > 0 &&
    stop > 0 &&
    spread >= 0 &&
    (direction === "long" ? stop < entry : stop > entry);
  const inverse = isInverseQuote(instrument);
  const conversionValid =
    !isJpyCross(instrument) ||
    (Number.isFinite(input.usdJpy) && Number(input.usdJpy) > 0);
  const spreadPerUnit = spread / quoteDivisor(input, entry);
  const riskPerUnit =
    Math.abs(entry - stop) / quoteDivisor(input, stop) + spreadPerUnit;
  return CFD_TARGET_RATIOS.map((ratio) => {
    const netPerUnit = riskPerUnit * ratio;
    const grossPerUnit = netPerUnit + spreadPerUnit;
    const sign = direction === "long" ? 1 : -1;
    const denominator = 1 - sign * grossPerUnit;
    const price = inverse
      ? entry / denominator
      : entry + sign * grossPerUnit * quoteDivisor(input, entry);
    const achievable =
      valid &&
      conversionValid &&
      Number.isFinite(price) &&
      Number.isFinite(netPerUnit) &&
      price > 0 &&
      (!inverse || denominator > 0) &&
      (direction === "long" ? price > entry : price < entry);
    return {
      ratio,
      price: achievable ? price : null,
      netPerUnit: achievable ? netPerUnit : null,
    };
  });
}
