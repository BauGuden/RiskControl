import type { CfdInput } from "./calculateCfd";
import { isInverseQuote, isJpyCross } from "./instruments";

export function quoteDivisor(
  input: Pick<CfdInput, "instrument" | "usdJpy">,
  price: number,
): number {
  return isInverseQuote(input.instrument)
    ? price
    : isJpyCross(input.instrument)
      ? (input.usdJpy ?? NaN)
      : 1;
}
