import { describe, expect, it } from "vitest";
import { searchSymbolPairs, SYMBOL_PAIRS } from "./symbolPairs";

describe("symbol pair dictionary", () => {
  it("keeps at least 80 common pairs available", () => {
    expect(SYMBOL_PAIRS.length).toBeGreaterThanOrEqual(80);
  });

  it("searches by symbol, base asset, project name, and group", () => {
    expect(searchSymbolPairs("btc").map((pair) => pair.symbol)).toContain("BTCUSDT");
    expect(searchSymbolPairs("Hyperliquid").map((pair) => pair.symbol)).toContain("HYPEUSDT");
    expect(searchSymbolPairs("Layer 2").map((pair) => pair.symbol)).toEqual(
      expect.arrayContaining(["ARBUSDT", "OPUSDT"])
    );
  });
});
