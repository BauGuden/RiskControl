import {
  localTradeInterpreter,
  TradeInterpretationError,
  type TradeIntent,
  type TradeInterpreter
} from "./tradeInterpreter";
import type { Broker, Market } from "../../types";

export type GeminiChatContext = {
  symbol: string;
  broker: Broker;
  market: Market;
  side: "Long" | "Short";
  risk: number;
  entry: number;
  stop: number;
  sizeUnits: number;
  baseAsset: string;
  notionalEntry: number;
  totalLossAtStop: number;
};

export type GeminiChatResponse =
  | {
      kind: "trade";
      intent: TradeIntent;
    }
  | {
      kind: "answer";
      answer: string;
    };

function isTradeIntent(value: unknown): value is TradeIntent {
  if (!value || typeof value !== "object") return false;

  const intent = value as Record<string, unknown>;
  return (
    typeof intent.symbol === "string" &&
    typeof intent.risk === "number" &&
    Number.isFinite(intent.risk) &&
    typeof intent.entry === "number" &&
    Number.isFinite(intent.entry) &&
    typeof intent.stop === "number" &&
    Number.isFinite(intent.stop)
  );
}

function isBroker(value: unknown): value is Broker {
  return ["BINANCE", "BYBIT", "MEXC", "BITGET", "BITUNIX", "CUSTOM"].includes(String(value));
}

function isMarket(value: unknown): value is Market {
  return value === "spot" || value === "futures";
}

function getError(payload: unknown): string {
  return payload && typeof payload === "object" && typeof (payload as { error?: unknown }).error === "string"
    ? (payload as { error: string }).error
    : "Gemini no pudo responder.";
}

export async function askGemini(
  message: string,
  context?: GeminiChatContext
): Promise<GeminiChatResponse> {
  const response = await fetch("/api/interpret-trade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, context })
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok || !payload || typeof payload !== "object") {
    throw new TradeInterpretationError(getError(payload));
  }

  const result = payload as Record<string, unknown>;
  if (result.kind === "answer" && typeof result.answer === "string") {
    return { kind: "answer", answer: result.answer };
  }

  if (result.kind === "trade" && isTradeIntent(result)) {
    return {
      kind: "trade",
      intent: {
        symbol: result.symbol,
        risk: result.risk,
        entry: result.entry,
        stop: result.stop,
        ...(isBroker(result.broker) ? { broker: result.broker } : {}),
        ...(isMarket(result.market) ? { market: result.market } : {})
      }
    };
  }

  throw new TradeInterpretationError("Gemini devolvió una respuesta inválida.");
}

export const geminiTradeInterpreter: TradeInterpreter = {
  async interpret(message) {
    const response = await askGemini(message);
    if (response.kind === "answer") {
      throw new TradeInterpretationError(response.answer);
    }

    return response.intent;
  }
};

export const resilientTradeInterpreter: TradeInterpreter = {
  async interpret(message) {
    try {
      return await geminiTradeInterpreter.interpret(message);
    } catch {
      return localTradeInterpreter.interpret(message);
    }
  }
};
