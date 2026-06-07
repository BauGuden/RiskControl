export type Market = "spot" | "futures";

export type Broker = "BINANCE" | "BYBIT" | "MEXC" | "BITGET" | "BITUNIX" | "CUSTOM";

export type OrderRole = "maker" | "taker";

export type Side = "Long" | "Short";

export type FeePair = {
  maker: number;
  taker: number;
};

export type FeePreset = {
  label: string;
  spot: FeePair;
  futures: FeePair;
  note?: string;
};

export type CalculatorInput = {
  symbol: string;
  market: Market;
  broker: Broker;
  entry: number;
  stop: number;
  risk: number;
  feeInPct: number;
  feeOutPct: number;
  includeFeesInRisk: boolean;
  leverage?: number;
};

export type TargetResult = {
  rr: number;
  price: number;
  profitGross: number;
  feeCloseAtTarget: number;
  profitNet: number;
};

export type CalculatorResult = {
  symbol: string;
  market: Market;
  broker: Broker;
  side: Side;
  distance: number;
  sizeUnits: number;
  baseAsset: string;
  notionalEntry: number;
  notionalStop: number;
  marginRequired?: number;
  breakEvenPrice: number;
  feeOpen: number;
  feeCloseAtStop: number;
  feesTotalAtStop: number;
  lossByPrice: number;
  totalLossAtStop: number;
  targets: TargetResult[];
};

export type ValidationError = {
  field: string;
  message: string;
};
