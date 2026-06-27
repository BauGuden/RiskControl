import type { Broker, Market } from "../../types";

export type TradeIntent = {
  symbol: string;
  risk: number;
  entry: number;
  stop: number;
  broker?: Broker;
  market?: Market;
};

export interface TradeInterpreter {
  interpret(message: string): Promise<TradeIntent>;
}

export class TradeInterpretationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TradeInterpretationError";
  }
}

const SYMBOL_ALIASES = [
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
  "SHIB"
];

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;

  let normalized = value.replace(/\s/g, "");
  const lastComma = normalized.lastIndexOf(",");
  const lastDot = normalized.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    normalized = normalized.split(thousandsSeparator).join("").replace(decimalSeparator, ".");
  } else if (lastComma >= 0) {
    const decimals = normalized.length - lastComma - 1;
    normalized = decimals > 0 && decimals <= 2 ? normalized.replace(",", ".") : normalized.split(",").join("");
  } else if (lastDot >= 0) {
    const decimals = normalized.length - lastDot - 1;
    if (decimals === 3 && normalized.slice(0, lastDot).length <= 3) {
      normalized = normalized.split(".").join("");
    }
  }

  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function extractNumber(message: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = message.match(pattern);
    const value = parseNumber(match?.[1]);
    if (value !== null) return value;
  }

  return null;
}

function extractSymbol(message: string): string | null {
  const normalized = message.toUpperCase();
  const explicitPair = normalized.match(/\b([A-Z0-9]{2,12})\s*[/_-]?\s*(?:USDT|USDC|USD)\b/);
  if (explicitPair) return explicitPair[1];

  const knownSymbol = SYMBOL_ALIASES.find((symbol) => new RegExp(`\\b${symbol}\\b`).test(normalized));
  if (knownSymbol) return knownSymbol;

  const labeledSymbol = normalized.match(/\b(?:PAR|ACTIVO|MONEDA|TICKER)\s*[:=-]?\s*([A-Z0-9]{2,12})\b/);
  return labeledSymbol?.[1] ?? null;
}

function extractBroker(message: string): Broker | null {
  const normalized = message.toUpperCase();
  const brokers: Broker[] = ["BINANCE", "BYBIT", "MEXC", "BITGET", "BITUNIX"];
  return brokers.find((broker) => new RegExp(`\\b${broker}\\b`).test(normalized)) ?? null;
}

function extractMarket(message: string): Market | null {
  if (/\b(?:futures?|futuros?|perpetuos?)\b/i.test(message)) return "futures";
  if (/\bspot\b/i.test(message)) return "spot";
  return null;
}

export const localTradeInterpreter: TradeInterpreter = {
  async interpret(message) {
    const symbol = extractSymbol(message);
    const broker = extractBroker(message);
    const market = extractMarket(message);
    const risk = extractNumber(message, [
      /(?:arriesg\w*|riesgo|perder\w*)\s*(?:hasta|de)?\s*\$?\s*([\d.,]+)/i,
      /\$\s*([\d.,]+)\s*(?:de\s+)?riesgo/i
    ]);
    const entry = extractNumber(message, [
      /(?:entrada|entry|entrar\w*|entro)\s*(?:en|a|de|:|=)?\s*\$?\s*([\d.,]+)/i
    ]);
    const stop = extractNumber(message, [
      /(?:stop\s*loss|stop|s\.?\s*l\.?)\s*(?:en|a|de|:|=)?\s*\$?\s*([\d.,]+)/i
    ]);

    const missing = [
      !symbol ? "el activo" : null,
      risk === null ? "el riesgo" : null,
      entry === null ? "la entrada" : null,
      stop === null ? "el stop loss" : null
    ].filter((field): field is string => field !== null);

    if (!symbol || risk === null || entry === null || stop === null) {
      throw new TradeInterpretationError(
        `Me falta ${missing.join(", ")}. Ejemplo: BTC, arriesgar $8, entrada 61800, SL 62250.`
      );
    }

    return {
      symbol: `${symbol}USDT`,
      risk,
      entry,
      stop,
      ...(broker ? { broker } : {}),
      ...(market ? { market } : {})
    };
  }
};
