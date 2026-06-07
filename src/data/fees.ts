import type { Broker, FeePreset, Market, OrderRole } from "../types";

export const FEE_VERIFIED_AT = "7 de junio de 2026";

export const FEE_PRESETS: Record<Exclude<Broker, "CUSTOM">, FeePreset> = {
  BINANCE: {
    label: "Binance",
    spot: { maker: 0.1, taker: 0.1 },
    futures: { maker: 0.02, taker: 0.05 }
  },
  BYBIT: {
    label: "Bybit",
    spot: { maker: 0.1, taker: 0.1 },
    futures: { maker: 0.02, taker: 0.055 }
  },
  MEXC: {
    label: "MEXC",
    spot: { maker: 0, taker: 0 },
    futures: { maker: 0, taker: 0.04 },
    note: "MEXC mantiene pares y eventos 0-fee; valida el par exacto antes de operar."
  },
  BITGET: {
    label: "Bitget",
    spot: { maker: 0.1, taker: 0.1 },
    futures: { maker: 0.02, taker: 0.06 }
  },
  BITUNIX: {
    label: "Bitunix",
    spot: { maker: 0.08, taker: 0.1 },
    futures: { maker: 0.02, taker: 0.06 }
  }
};

export const BROKER_OPTIONS: Broker[] = [
  "BINANCE",
  "BYBIT",
  "MEXC",
  "BITGET",
  "BITUNIX",
  "CUSTOM"
];

export function getBrokerLabel(broker: Broker): string {
  if (broker === "CUSTOM") return "Custom";
  return FEE_PRESETS[broker].label;
}

export function getDefaultFeePct(
  broker: Broker,
  market: Market,
  role: OrderRole
): number {
  if (broker === "CUSTOM") return 0.1;
  return FEE_PRESETS[broker][market][role];
}

export function getPresetNote(broker: Broker): string | undefined {
  if (broker === "CUSTOM") return undefined;
  return FEE_PRESETS[broker].note;
}
