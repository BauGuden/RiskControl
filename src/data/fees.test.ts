import { describe, expect, it } from "vitest";
import { getDefaultFeePct } from "./fees";

describe("fee presets", () => {
  it("returns maker and taker defaults by broker and market", () => {
    expect(getDefaultFeePct("BINANCE", "spot", "maker")).toBe(0.1);
    expect(getDefaultFeePct("BINANCE", "futures", "maker")).toBe(0.02);
    expect(getDefaultFeePct("BYBIT", "futures", "taker")).toBe(0.055);
    expect(getDefaultFeePct("MEXC", "spot", "taker")).toBe(0);
    expect(getDefaultFeePct("BITUNIX", "spot", "maker")).toBe(0.08);
  });

  it("keeps custom fees on a neutral editable default", () => {
    expect(getDefaultFeePct("CUSTOM", "spot", "maker")).toBe(0.1);
    expect(getDefaultFeePct("CUSTOM", "futures", "taker")).toBe(0.1);
  });
});
