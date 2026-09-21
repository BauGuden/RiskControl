import { findTradingSymbolInText, normalizeTradingSymbol } from "../../src/data/assetSymbols";

const SYSTEM_INSTRUCTION = `
Eres el asistente conversacional de DGBM Risk Control, impulsado por Gemini de Google.
Clasifica cada mensaje como "trade" o "answer".

Reglas:
- Usa "trade" cuando el usuario proporcione una operación completa. Extrae symbol, risk, entry, stop, broker, market y feeProfile.
- Normaliza el activo contra USDT: BTC debe ser BTCUSDT.
- Reconoce nombres de proyectos y conviértelos a su ticker: Solana es SOLUSDT, Ethereum es ETHUSDT, Bitcoin es BTCUSDT y Cardano es ADAUSDT.
- Reconoce cashtags como activos: $NOBODY significa NOBODYUSDT y $SOL significa SOLUSDT.
- Brokers admitidos: BINANCE, BYBIT, MEXC, BITGET y BITUNIX. Usa null cuando no se indique.
- market debe ser "spot", "futures" o null cuando no se indique.
- feeProfile debe ser "standard", "bnb", "bgb", "zero-fee", "mexc-btc", "mexc-eth", "api" o null. Detecta "con BNB", "con BGB", "0-fee/sin comisiones" y "por API/ejecución automática". Para MEXC Futures web/app usa "mexc-btc" en BTCUSDT y "mexc-eth" en ETHUSDT, salvo que el usuario indique 0-fee o API.
- broker y market son opcionales: no los solicites ni impidas el cálculo si symbol, risk, entry y stop ya están completos.
- Si el usuario dice short, venta en corto o posición corta, usa market "futures" salvo que indique otro mercado explícitamente.
- risk es el dinero máximo que el usuario acepta perder.
- Reconoce SL, stop y stop loss como stop.
- Usa "answer" para preguntas, saludos, conceptos de trading y operaciones incompletas.
- En "answer", responde en español de forma breve usando el contexto del último cálculo cuando sea útil.
- Si preguntan tu identidad, explica que eres el asistente de DGBM Risk Control y que usas Gemini de Google.
- Puedes explicar size, notional, riesgo, fees, margen, apalancamiento, funding, spread y slippage.
- Tarifas base verificadas el 20 de septiembre de 2026: Binance Spot 0.10%/0.10% y Futures 0.020%/0.050%; con BNB 0.075%/0.075% y 0.018%/0.045%. Bybit VIP 0 Spot 0.10%/0.10% y Futures 0.020%/0.055%. Bitunix VIP 0 Spot 0.080%/0.10% y Futures 0.020%/0.060%. Bitget estándar Spot 0.10%/0.10% y Futures 0.020%/0.060%; Spot con BGB 0.080%/0.080%.
- MEXC web/app fuera de promociones: Spot 0% maker/0.050% taker y Futures aproximadamente 0.010%/0.040%. Los pares elegibles 0-Fee Fest son 0%/0%, pero dependen del par, cuenta y región. MEXC Futures API cobra 0.060% maker/0.080% taker desde el 1 de junio de 2026 y esa tarifa prevalece sobre promociones y descuentos.
- Funding, spread y slippage no son trading fees fijos. No los inventes; pide el dato o recomienda usar un supuesto editable.
- No calcules el size dentro de una respuesta, no recomiendes operaciones y no inventes datos.
- No confundas apalancamiento con riesgo.
- Si a una operación le faltan datos, usa "answer" y solicita únicamente los datos faltantes.
- Combina los datos del historial pendiente con el mensaje actual. El usuario puede completar riesgo, activo, entrada, stop, broker o mercado en varios mensajes.
- El historial pendiente pertenece a la misma operación y tiene prioridad sobre el contexto del último cálculo.
- Nunca completes un activo faltante usando solamente el contexto de una operación ya calculada.

Devuelve exclusivamente uno de estos objetos JSON, sin Markdown ni texto adicional:
{"kind":"trade","symbol":"BTCUSDT","risk":8,"entry":61800,"stop":62250,"broker":"MEXC","market":"futures","feeProfile":"api","answer":null}
{"kind":"answer","symbol":null,"risk":null,"entry":null,"stop":null,"broker":null,"market":null,"feeProfile":null,"answer":"Respuesta breve"}
`.trim();

type GeminiGenerateContent = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function normalizeSymbol(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return normalizeTradingSymbol(value);
}

function positiveNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function normalizeBroker(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const broker = value.trim().toUpperCase();
  return ["BINANCE", "BYBIT", "MEXC", "BITGET", "BITUNIX"].includes(broker) ? broker : null;
}

function normalizeMarket(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const market = value.trim().toLowerCase();
  return market === "spot" || market === "futures" ? market : null;
}

function normalizeFeeProfile(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const profile = value.trim().toLowerCase();
  return ["standard", "bnb", "bgb", "zero-fee", "mexc-btc", "mexc-eth", "api"].includes(profile)
    ? profile
    : null;
}

function looksLikeOperation(message: string): boolean {
  return (
    /(?:entrada|entry|entro)/i.test(message) &&
    /(?:stop|s\.?\s*l\.?)/i.test(message) &&
    /(?:riesgo|arriesg|perder)/i.test(message)
  );
}

function hasExplicitAsset(message: string): boolean {
  if (findTradingSymbolInText(message)) return true;

  return /\b(?:ACTIVO|PAR|MONEDA|TICKER)\s*[:=-]?\s*[A-Z0-9]{2,16}\b/i.test(message);
}

function symbolWasProvided(message: string, symbol: string): boolean {
  const baseAsset = symbol.replace(/(?:USDT|USDC|USD)$/i, "");
  const brokerNames = ["BINANCE", "BYBIT", "MEXC", "BITGET", "BITUNIX"];

  if (!baseAsset || brokerNames.includes(baseAsset)) return false;

  const symbolFromMessage = findTradingSymbolInText(message);
  if (symbolFromMessage) {
    return symbolFromMessage.replace(/USDT$/, "") === baseAsset;
  }

  const normalizedMessage = message.toUpperCase();
  const escapedAsset = baseAsset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escapedAsset}(?:\\s*[/_-]?\\s*(?:USDT|USDC|USD))?\\b`).test(normalizedMessage);
}

function getOutputText(response: GeminiGenerateContent): string | null {
  const text = response.candidates?.[0]?.content?.parts
    ?.filter((part) => typeof part.text === "string")
    .map((part) => part.text)
    .join("");

  return text || null;
}

export default async (request: Request) => {
  if (request.method !== "POST") {
    return json({ error: "Método no permitido." }, 405);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: "Gemini no está configurado." }, 503);
  }

  let message: unknown;
  let context: unknown;
  let history: unknown;

  try {
    const body = (await request.json()) as { message?: unknown; context?: unknown; history?: unknown };
    message = body.message;
    context = body.context;
    history = body.history;
  } catch {
    return json({ error: "El cuerpo de la solicitud no es válido." }, 400);
  }

  if (typeof message !== "string" || !message.trim() || message.length > 1000) {
    return json({ error: "El mensaje debe contener entre 1 y 1000 caracteres." }, 400);
  }

  if (looksLikeOperation(message) && !hasExplicitAsset(message)) {
    return json({
      kind: "answer",
      answer: "Me falta el activo o par. Ejemplo: ADA, BTCUSDT o ETH/USDT."
    });
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (item): item is { role: "user" | "assistant"; text: string } =>
            Boolean(item) &&
            typeof item === "object" &&
            ((item as { role?: unknown }).role === "user" || (item as { role?: unknown }).role === "assistant") &&
            typeof (item as { text?: unknown }).text === "string"
        )
        .slice(-6)
        .map((item) => ({
          role: item.role,
          text: item.text.trim().slice(0, 1000)
        }))
        .filter((item) => item.text)
    : [];

  const input = [
    safeHistory.length > 0
      ? `Historial pendiente de esta misma operación:\n${safeHistory
          .map((item) => `${item.role === "user" ? "Usuario" : "Asistente"}: ${item.text}`)
          .join("\n")}`
      : null,
    `Mensaje actual del usuario:\n${message}`,
    context ? `Contexto de la última operación ya calculada:\n${JSON.stringify(context)}` : null
  ]
    .filter(Boolean)
    .join("\n\n");
  const currentOperationMessages = [...safeHistory.map((item) => item.text), message].join("\n");

  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: input }]
            }
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 300,
            responseMimeType: "application/json"
          }
        }),
        signal: AbortSignal.timeout(12_000)
      }
    );

    if (!response.ok) {
      console.error(`Gemini respondió con estado ${response.status}.`);
      return json({ error: "Gemini rechazó la solicitud." }, 502);
    }

    const generated = (await response.json()) as GeminiGenerateContent;
    const outputText = getOutputText(generated);

    if (!outputText) {
      return json({ error: "Gemini no devolvió una respuesta interpretable." }, 502);
    }

    const extracted = JSON.parse(outputText) as Record<string, unknown>;

    if (extracted.kind === "answer") {
      const answer = typeof extracted.answer === "string" ? extracted.answer.trim() : "";
      return answer
        ? json({ kind: "answer", answer })
        : json({ error: "Gemini no devolvió una respuesta válida." }, 502);
    }

    const intent = {
      symbol: normalizeSymbol(extracted.symbol),
      risk: positiveNumber(extracted.risk),
      entry: positiveNumber(extracted.entry),
      stop: positiveNumber(extracted.stop),
      broker: normalizeBroker(extracted.broker),
      market: normalizeMarket(extracted.market),
      feeProfile: normalizeFeeProfile(extracted.feeProfile)
    };

    if (intent.symbol && !symbolWasProvided(currentOperationMessages, intent.symbol)) {
      return json({
        kind: "answer",
        answer: "Me falta el activo o par. Ejemplo: ADA, BTCUSDT o ETH/USDT."
      });
    }

    const missing = (["symbol", "risk", "entry", "stop"] as const).filter((field) => intent[field] === null);

    if (missing.length > 0) {
      return json({ error: "Faltan datos para calcular la operación.", missing }, 422);
    }

    return json({ kind: "trade", ...intent });
  } catch (error) {
    console.error("No se pudo consultar Gemini.", error);
    return json({ error: "No se pudo consultar Gemini." }, 502);
  }
};

export const config = {
  path: "/api/interpret-trade"
};
