import { describe, expect, it } from "vitest";
import { localTradeInterpreter } from "./tradeInterpreter";

describe("localTradeInterpreter", () => {
  it("interpreta una operación short escrita en lenguaje natural", async () => {
    await expect(
      localTradeInterpreter.interpret("BTC quiero arriesgar 8$ la entrada en 61800 mi Sl 62250")
    ).resolves.toEqual({
      symbol: "BTCUSDT",
      risk: 8,
      entry: 61800,
      stop: 62250
    });
  });

  it("acepta un par explícito y valores decimales", async () => {
    await expect(
      localTradeInterpreter.interpret("ETH/USDT riesgo 10,50 entrada 3500.25 stop loss 3450")
    ).resolves.toEqual({
      symbol: "ETHUSDT",
      risk: 10.5,
      entry: 3500.25,
      stop: 3450
    });
  });

  it("extrae el exchange y el mercado cuando están presentes", async () => {
    await expect(
      localTradeInterpreter.interpret(
        "BTC riesgo 8 entrada 61800 SL 62250 en el exchange MEXC futures"
      )
    ).resolves.toMatchObject({
      broker: "MEXC",
      market: "futures"
    });
  });

  it("indica los datos que faltan", async () => {
    await expect(localTradeInterpreter.interpret("BTC con entrada 61800")).rejects.toThrow(
      "el riesgo, el stop loss"
    );
  });
});
