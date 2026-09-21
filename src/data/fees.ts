import type {
  Broker,
  FeePair,
  FeePreset,
  FeeProfile,
  FeeProfileOption,
  Market,
  OrderRole
} from "../types";

export const FEE_VERIFIED_AT = "20 de septiembre de 2026";

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
    spot: { maker: 0, taker: 0.05 },
    futures: { maker: 0.01, taker: 0.04 },
    note: "Tarifa de referencia fuera de promociones. En MEXC depende del par, la región y la ruta de ejecución."
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

const PROFILE_FEES: Partial<
  Record<Exclude<Broker, "CUSTOM">, Partial<Record<Market, Partial<Record<FeeProfile, FeePair>>>>>
> = {
  BINANCE: {
    spot: { bnb: { maker: 0.075, taker: 0.075 } },
    futures: { bnb: { maker: 0.018, taker: 0.045 } }
  },
  MEXC: {
    spot: { "zero-fee": { maker: 0, taker: 0 } },
    futures: {
      "zero-fee": { maker: 0, taker: 0 },
      "mexc-btc": { maker: 0, taker: 0.02 },
      "mexc-eth": { maker: 0, taker: 0.01 },
      api: { maker: 0.06, taker: 0.08 }
    }
  },
  BITGET: {
    spot: { bgb: { maker: 0.08, taker: 0.08 } }
  }
};

const PROFILE_LABELS: Record<FeeProfile, string> = {
  standard: "Estándar / VIP 0",
  bnb: "Pago con BNB",
  bgb: "Pago con BGB",
  "zero-fee": "0-Fee Fest (web/app)",
  "mexc-btc": "BTCUSDT especial (web/app)",
  "mexc-eth": "ETHUSDT especial (web/app)",
  api: "Trading automático por API"
};

const PROFILE_NOTES: Partial<Record<FeeProfile, string>> = {
  bnb: "Requiere activar el pago de comisiones con BNB y mantener saldo suficiente.",
  bgb: "Descuento Spot sujeto a activación, saldo BGB y elegibilidad de la cuenta.",
  "zero-fee": "Solo para pares, cuentas y regiones elegibles en web/app; confirma la etiqueta 0 Fees antes de operar.",
  "mexc-btc": "Referencia para BTCUSDT Futures en web/app. Confirma la tarifa mostrada en tu cuenta antes de operar.",
  "mexc-eth": "Referencia para ETHUSDT Futures en web/app. Confirma la tarifa mostrada en tu cuenta antes de operar.",
  api: "MEXC Futures API aplica 0.060% maker y 0.080% taker desde el 1 de junio de 2026; prevalece sobre promociones y descuentos."
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
  role: OrderRole,
  profile: FeeProfile = "standard"
): number {
  if (broker === "CUSTOM") return 0.1;
  const resolvedProfile = resolveFeeProfile(broker, market, profile);
  return resolvedProfile === "standard"
    ? FEE_PRESETS[broker][market][role]
    : PROFILE_FEES[broker]?.[market]?.[resolvedProfile]?.[role] ?? FEE_PRESETS[broker][market][role];
}

export function getFeeProfileOptions(broker: Broker, market: Market): FeeProfileOption[] {
  if (broker === "CUSTOM") {
    return [{ id: "standard", label: "Fee editable", fees: { maker: 0.1, taker: 0.1 } }];
  }

  const profiles: FeeProfileOption[] = [
    {
      id: "standard",
      label: PROFILE_LABELS.standard,
      fees: FEE_PRESETS[broker][market],
      note: FEE_PRESETS[broker].note
    }
  ];

  const brokerProfiles = PROFILE_FEES[broker]?.[market];
  for (const profile of ["bnb", "bgb", "zero-fee", "mexc-btc", "mexc-eth", "api"] as const) {
    const fees = brokerProfiles?.[profile];
    if (fees) {
      profiles.push({ id: profile, label: PROFILE_LABELS[profile], fees, note: PROFILE_NOTES[profile] });
    }
  }

  return profiles;
}

export function resolveFeeProfile(broker: Broker, market: Market, profile: FeeProfile): FeeProfile {
  return getFeeProfileOptions(broker, market).some((option) => option.id === profile) ? profile : "standard";
}

export function getFeeProfileLabel(profile: FeeProfile): string {
  return PROFILE_LABELS[profile];
}

export function getPresetNote(
  broker: Broker,
  market: Market,
  profile: FeeProfile = "standard"
): string | undefined {
  if (broker === "CUSTOM") return undefined;
  const resolvedProfile = resolveFeeProfile(broker, market, profile);
  return getFeeProfileOptions(broker, market).find((option) => option.id === resolvedProfile)?.note;
}
