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

  it.each([
    ["Solana", "SOLUSDT"],
    ["Ethereum", "ETHUSDT"],
    ["Bitcoin Cash", "BCHUSDT"]
  ])("reconoce el nombre %s como %s", async (assetName, symbol) => {
    await expect(
      localTradeInterpreter.interpret(`${assetName}, riesgo 8 entrada 140 stop 135`)
    ).resolves.toMatchObject({ symbol });
  });

  it("combina datos de varios mensajes y acepta un par explícito fuera del catálogo", async () => {
    await expect(
      localTradeInterpreter.interpret(
        "8$ de riesgo en MEXC\nHaré un short en NOBODYUSDT, entrada 0.02, SL 0.025"
      )
    ).resolves.toMatchObject({
      symbol: "NOBODYUSDT",
      risk: 8,
      entry: 0.02,
      stop: 0.025,
      broker: "MEXC",
      market: "futures"
    });
  });

  it("reconoce un cashtag desconocido en una operación completa", async () => {
    await expect(
      localTradeInterpreter.interpret(
        "Haré un short a la moneda $NOBODY con una entrada de 0.025 y un SL en 0.028 arriesgando 8$ en MEXC"
      )
    ).resolves.toMatchObject({
      symbol: "NOBODYUSDT",
      risk: 8,
      entry: 0.025,
      stop: 0.028,
      broker: "MEXC",
      market: "futures"
    });
  });
});
