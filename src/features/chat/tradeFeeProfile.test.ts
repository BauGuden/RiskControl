import { describe, expect, it } from "vitest";
import { localTradeInterpreter } from "./tradeInterpreter";

describe("perfil de fees en mensajes de trading", () => {
  it("detecta ejecución de futuros MEXC por API", async () => {
    const intent = await localTradeInterpreter.interpret(
      "BTC riesgo 8 entrada 61800 stop 62250 futuros MEXC por API"
    );

    expect(intent).toMatchObject({
      broker: "MEXC",
      market: "futures",
      feeProfile: "api"
    });
  });

  it("detecta descuentos y promociones", async () => {
    const bnb = await localTradeInterpreter.interpret(
      "BTC riesgo 8 entrada 61800 stop 62250 Binance con BNB"
    );
    const zeroFee = await localTradeInterpreter.interpret(
      "ETH riesgo 8 entrada 3000 stop 2900 MEXC en un par 0-fee"
    );

    expect(bnb.feeProfile).toBe("bnb");
    expect(zeroFee.feeProfile).toBe("zero-fee");
  });

  it("usa la referencia especial para BTCUSDT Futures de MEXC", async () => {
    const intent = await localTradeInterpreter.interpret(
      "BTC riesgo 8 entrada 61800 stop 62250 futuros MEXC"
    );

    expect(intent.feeProfile).toBe("mexc-btc");
  });
});
