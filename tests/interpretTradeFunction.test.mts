import { afterEach, describe, expect, it, vi } from "vitest";
import interpretTrade from "../netlify/functions/interpret-trade.mts";

describe("interpret-trade function", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.GEMINI_API_KEY;
  });

  it("combina un par desconocido del historial con los datos del mensaje actual", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const geminiFetch = vi.fn().mockResolvedValue(
      Response.json({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    kind: "trade",
                    symbol: "NOBODYUSDT",
                    risk: 8,
                    entry: 0.02,
                    stop: 0.025,
                    broker: "MEXC",
                    market: "futures",
                    answer: null
                  })
                }
              ]
            }
          }
        ]
      })
    );
    vi.stubGlobal("fetch", geminiFetch);

    const response = await interpretTrade(
      new Request("http://localhost/api/interpret-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "8$ de riesgo y en MEXC",
          history: [
            {
              role: "user",
              text: "Haré un short en NOBODYUSDT, entrada 0.02, SL 0.025"
            }
          ]
        })
      })
    );

    await expect(response.json()).resolves.toMatchObject({
      kind: "trade",
      symbol: "NOBODYUSDT",
      risk: 8,
      entry: 0.02,
      stop: 0.025,
      broker: "MEXC"
    });

    const upstreamBody = JSON.parse(String(geminiFetch.mock.calls[0]?.[1]?.body));
    expect(upstreamBody.contents[0].parts[0].text).toContain("NOBODYUSDT");
    expect(upstreamBody.contents[0].parts[0].text).toContain("8$ de riesgo");
  });
});
