import { describe, expect, it } from "vitest";
import { findTradingSymbolInText, normalizeTradingSymbol } from "./assetSymbols";

describe("asset symbol resolver", () => {
  it("normaliza nombres de proyectos y tickers contra USDT", () => {
    expect(normalizeTradingSymbol("Solana")).toBe("SOLUSDT");
    expect(normalizeTradingSymbol("Ethereum")).toBe("ETHUSDT");
    expect(normalizeTradingSymbol("ETH/USDC")).toBe("ETHUSDT");
    expect(normalizeTradingSymbol("NOBODYUSDT")).toBe("NOBODYUSDT");
  });

  it("encuentra nombres de proyectos dentro de lenguaje natural", () => {
    expect(findTradingSymbolInText("Quiero operar Solana con riesgo de 8")).toBe("SOLUSDT");
    expect(findTradingSymbolInText("Una entrada en Ethereum Classic")).toBe("ETCUSDT");
    expect(findTradingSymbolInText("Analiza Bitcoin Cash por favor")).toBe("BCHUSDT");
    expect(findTradingSymbolInText("Haré un short en NOBODYUSDT")).toBe("NOBODYUSDT");
    expect(findTradingSymbolInText("Haré un short a la moneda $NOBODY")).toBe("NOBODYUSDT");
  });

  it("no confunde un activo mencionado con otro", () => {
    expect(findTradingSymbolInText("Solana con entrada 140")).not.toBe("ETHUSDT");
  });
});
