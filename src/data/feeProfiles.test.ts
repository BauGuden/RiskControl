import { describe, expect, it } from "vitest";
import { getDefaultFeePct, getFeeProfileOptions, resolveFeeProfile } from "./fees";

describe("perfiles de comisiones", () => {
  it("aplica la tarifa separada de MEXC Futures API", () => {
    expect(getDefaultFeePct("MEXC", "futures", "maker", "api")).toBe(0.06);
    expect(getDefaultFeePct("MEXC", "futures", "taker", "api")).toBe(0.08);
  });

  it("mantiene separadas las tarifas estándar y 0-fee de MEXC", () => {
    expect(getDefaultFeePct("MEXC", "spot", "taker")).toBe(0.05);
    expect(getDefaultFeePct("MEXC", "futures", "maker")).toBe(0.01);
    expect(getDefaultFeePct("MEXC", "futures", "taker", "zero-fee")).toBe(0);
  });

  it("incluye las referencias especiales de BTCUSDT y ETHUSDT en MEXC", () => {
    expect(getDefaultFeePct("MEXC", "futures", "taker", "mexc-btc")).toBe(0.02);
    expect(getDefaultFeePct("MEXC", "futures", "taker", "mexc-eth")).toBe(0.01);
  });

  it("aplica descuentos por token cuando están disponibles", () => {
    expect(getDefaultFeePct("BINANCE", "spot", "maker", "bnb")).toBe(0.075);
    expect(getDefaultFeePct("BINANCE", "futures", "taker", "bnb")).toBe(0.045);
    expect(getDefaultFeePct("BITGET", "spot", "taker", "bgb")).toBe(0.08);
  });

  it("descarta perfiles que no aplican al broker y mercado", () => {
    expect(resolveFeeProfile("BINANCE", "futures", "api")).toBe("standard");
    expect(getFeeProfileOptions("MEXC", "spot").some((profile) => profile.id === "api")).toBe(false);
  });
});
