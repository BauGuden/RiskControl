import { afterEach, describe, expect, it, vi } from "vitest";
import { askGemini, geminiTradeInterpreter, resilientTradeInterpreter } from "./geminiTradeInterpreter";

describe("geminiTradeInterpreter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usa la intención estructurada devuelta por la función", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          kind: "trade",
          symbol: "BTCUSDT",
          risk: 8,
          entry: 61800,
          stop: 62250
        })
      )
    );

    await expect(geminiTradeInterpreter.interpret("mi operación")).resolves.toEqual({
      symbol: "BTCUSDT",
      risk: 8,
      entry: 61800,
      stop: 62250
    });
  });

  it("devuelve respuestas conversacionales de Gemini", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          kind: "answer",
          answer: "El notional es el valor total de la posición."
        })
      )
    );

    await expect(askGemini("¿Qué es notional?")).resolves.toEqual({
      kind: "answer",
      answer: "El notional es el valor total de la posición."
    });
  });

  it("recurre al intérprete local cuando Gemini no está disponible", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Sin conexión")));

    await expect(
      resilientTradeInterpreter.interpret("BTC riesgo 8 entrada 61800 SL 62250")
    ).resolves.toEqual({
      symbol: "BTCUSDT",
      risk: 8,
      entry: 61800,
      stop: 62250
    });
  });

  it("normaliza el nombre del proyecto aunque Gemini no devuelva el ticker", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          kind: "trade",
          symbol: "Solana",
          risk: 8,
          entry: 140,
          stop: 135
        })
      )
    );

    await expect(geminiTradeInterpreter.interpret("Solana riesgo 8 entrada 140 stop 135")).resolves.toMatchObject({
      symbol: "SOLUSDT"
    });
  });
});
