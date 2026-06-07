import { describe, expect, it } from "vitest";
import { calculateRisk, detectSide, validateInput } from "./calculateRisk";
import type { CalculatorInput } from "../types";

const baseInput: CalculatorInput = {
  symbol: "BTCUSDT",
  market: "futures",
  broker: "BINANCE",
  entry: 100,
  stop: 96,
  risk: 8,
  feeInPct: 0.05,
  feeOutPct: 0.05,
  includeFeesInRisk: false,
  leverage: 10
};

describe("detectSide", () => {
  it("detects long and short from entry and stop", () => {
    expect(detectSide(100, 96)).toBe("Long");
    expect(detectSide(100, 104)).toBe("Short");
    expect(detectSide(100, 100)).toBeNull();
  });
});

describe("calculateRisk", () => {
  it("calculates a long position without including fees in risk", () => {
    const result = calculateRisk(baseInput);

    expect(result.side).toBe("Long");
    expect(result.sizeUnits).toBeCloseTo(2);
    expect(result.notionalEntry).toBeCloseTo(200);
    expect(result.feeOpen).toBeCloseTo(0.1);
    expect(result.feeCloseAtStop).toBeCloseTo(0.096);
    expect(result.totalLossAtStop).toBeCloseTo(8.196);
    expect(result.targets[0].price).toBeCloseTo(104);
    expect(result.targets[4].price).toBeCloseTo(120);
  });

  it("calculates a short position and target prices below entry", () => {
    const result = calculateRisk({
      ...baseInput,
      entry: 100,
      stop: 104
    });

    expect(result.side).toBe("Short");
    expect(result.sizeUnits).toBeCloseTo(2);
    expect(result.targets[0].price).toBeCloseTo(96);
    expect(result.targets[4].price).toBeCloseTo(80);
  });

  it("reduces size when fees are included inside the risk budget", () => {
    const result = calculateRisk({
      ...baseInput,
      includeFeesInRisk: true
    });

    expect(result.sizeUnits).toBeLessThan(2);
    expect(result.totalLossAtStop).toBeCloseTo(8);
  });

  it("returns margin estimate for futures without changing risk sizing", () => {
    const result = calculateRisk({
      ...baseInput,
      leverage: 20
    });

    expect(result.sizeUnits).toBeCloseTo(2);
    expect(result.marginRequired).toBeCloseTo(10);
  });

  it("does not return margin estimate for spot", () => {
    const result = calculateRisk({
      ...baseInput,
      market: "spot",
      leverage: undefined
    });

    expect(result.marginRequired).toBeUndefined();
  });
});

describe("validateInput", () => {
  it("returns validation errors for invalid numeric values", () => {
    const errors = validateInput({
      ...baseInput,
      entry: 0,
      stop: 0,
      risk: -1,
      feeInPct: -0.1,
      feeOutPct: Number.NaN,
      leverage: 0
    });

    expect(errors.map((error) => error.field)).toEqual(
      expect.arrayContaining(["entry", "stop", "risk", "feeInPct", "feeOutPct", "leverage"])
    );
  });

  it("requires stop to differ from entry", () => {
    const errors = validateInput({
      ...baseInput,
      stop: 100
    });

    expect(errors.some((error) => error.field === "stop")).toBe(true);
  });
});
