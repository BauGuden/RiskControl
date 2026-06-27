const SYSTEM_INSTRUCTION = `
Eres el asistente conversacional de DGBM Risk Control, impulsado por Gemini de Google.
Clasifica cada mensaje como "trade" o "answer".

Reglas:
- Usa "trade" cuando el usuario proporcione una operación completa. Extrae symbol, risk, entry, stop, broker y market.
- Normaliza el activo contra USDT: BTC debe ser BTCUSDT.
- Brokers admitidos: BINANCE, BYBIT, MEXC, BITGET y BITUNIX. Usa null cuando no se indique.
- market debe ser "spot", "futures" o null cuando no se indique.
- risk es el dinero máximo que el usuario acepta perder.
- Reconoce SL, stop y stop loss como stop.
- Usa "answer" para preguntas, saludos, conceptos de trading y operaciones incompletas.
- En "answer", responde en español de forma breve usando el contexto del último cálculo cuando sea útil.
- Si preguntan tu identidad, explica que eres el asistente de DGBM Risk Control y que usas Gemini de Google.
- Puedes explicar size, notional, riesgo, fees, margen y apalancamiento.
- No calcules el size dentro de una respuesta, no recomiendes operaciones y no inventes datos.
- No confundas apalancamiento con riesgo.
- Si a una operación le faltan datos, usa "answer" y solicita únicamente los datos faltantes.
- Nunca completes un activo faltante usando el contexto de la operación anterior.

Devuelve exclusivamente uno de estos objetos JSON, sin Markdown ni texto adicional:
{"kind":"trade","symbol":"BTCUSDT","risk":8,"entry":61800,"stop":62250,"broker":"MEXC","market":"futures","answer":null}
{"kind":"answer","symbol":null,"risk":null,"entry":null,"stop":null,"broker":null,"market":null,"answer":"Respuesta breve"}
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

  const symbol = value.trim().toUpperCase().replace(/[-_/ ]/g, "");
  if (!/^[A-Z0-9]{2,16}$/.test(symbol)) return null;
  if (/(?:USDT|USDC|USD)$/.test(symbol)) return symbol;
  return `${symbol}USDT`;
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

function looksLikeOperation(message: string): boolean {
  return (
    /(?:entrada|entry|entro)/i.test(message) &&
    /(?:stop|s\.?\s*l\.?)/i.test(message) &&
    /(?:riesgo|arriesg|perder)/i.test(message)
  );
}

function hasExplicitAsset(message: string): boolean {
  const normalized = message.toUpperCase();
  const knownAssets = [
    "BTC",
    "ETH",
    "SOL",
    "BNB",
    "XRP",
    "ADA",
    "DOGE",
    "AVAX",
    "LINK",
    "SUI",
    "LTC",
    "BCH",
    "DOT",
    "TRX",
    "TON",
    "PEPE",
    "SHIB",
    "WIF"
  ];

  if (knownAssets.some((asset) => new RegExp(`\\b${asset}(?:USDT|USDC|USD)?\\b`).test(normalized))) {
    return true;
  }

  return /\b(?:ACTIVO|PAR|MONEDA|TICKER)\s*[:=-]?\s*[A-Z0-9]{2,16}\b/.test(normalized);
}

function symbolWasProvided(message: string, symbol: string): boolean {
  const baseAsset = symbol.replace(/(?:USDT|USDC|USD)$/i, "");
  const brokerNames = ["BINANCE", "BYBIT", "MEXC", "BITGET", "BITUNIX"];

  if (!baseAsset || brokerNames.includes(baseAsset)) return false;

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

  try {
    const body = (await request.json()) as { message?: unknown; context?: unknown };
    message = body.message;
    context = body.context;
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

  const input = context
    ? `Mensaje del usuario:\n${message}\n\nContexto del último cálculo:\n${JSON.stringify(context)}`
    : `Mensaje del usuario:\n${message}`;

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
      market: normalizeMarket(extracted.market)
    };

    if (intent.symbol && !symbolWasProvided(message, intent.symbol)) {
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
