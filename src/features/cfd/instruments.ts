export type CfdBroker = "Exness" | "Vantage";
export type InstrumentId =
  | "XAUUSD"
  | "BTCUSD"
  | "EURUSD"
  | "GBPUSD"
  | "USDJPY"
  | "USTEC"
  | "US30"
  | "US500"
  | "GBPJPY"
  | "XAGUSD"
  | "USOIL"
  | "ETHUSD"
  | "USDCAD"
  | "AUDUSD"
  | "EURJPY";
export const INSTRUMENT_IDS: InstrumentId[] = [
  "XAUUSD",
  "BTCUSD",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USTEC",
  "US30",
  "US500",
  "GBPJPY",
  "XAGUSD",
  "USOIL",
  "ETHUSD",
  "USDCAD",
  "AUDUSD",
  "EURJPY",
];
export const INDEX_IDS: InstrumentId[] = ["USTEC", "US30", "US500"];
export const isJpyCross = (id: InstrumentId) =>
  id === "GBPJPY" || id === "EURJPY";
export const isInverseQuote = (id: InstrumentId) =>
  id === "USDJPY" || id === "USDCAD";
export type AccountPreference = "auto" | "standard" | "cent";
export const LEVERAGES = [
  2,
  20,
  50,
  100,
  200,
  400,
  500,
  600,
  800,
  1000,
  2000,
  "unlimited",
] as const;
export type Leverage = (typeof LEVERAGES)[number];

export const INSTRUMENTS: Record<
  InstrumentId,
  {
    name: string;
    unit: string;
    contract: number;
    spread: number;
    entry: number;
    stop: number;
    tp: number;
  }
> = {
  XAUUSD: {
    name: "Oro",
    unit: "XAUT / oz",
    contract: 100,
    spread: 0.2,
    entry: 4100,
    stop: 4080,
    tp: 4120,
  },
  BTCUSD: {
    name: "Bitcoin",
    unit: "BTC",
    contract: 1,
    spread: 18,
    entry: 60000,
    stop: 59500,
    tp: 61000,
  },
  XAGUSD: {
    name: "Plata",
    unit: "oz XAG",
    contract: 5000,
    spread: 0.025,
    entry: 35,
    stop: 34.5,
    tp: 36,
  },
  GBPUSD: {
    name: "Libra / dólar",
    unit: "GBP",
    contract: 100000,
    spread: 0.0001,
    entry: 1.3,
    stop: 1.295,
    tp: 1.31,
  },
  USDJPY: {
    name: "Dólar / yen",
    unit: "USD",
    contract: 100000,
    spread: 0.012,
    entry: 150,
    stop: 149,
    tp: 152,
  },
  USTEC: {
    name: "Nasdaq 100",
    unit: "Idx",
    contract: 1,
    spread: 1.8,
    entry: 20100,
    stop: 20050,
    tp: 20200,
  },
  EURUSD: {
    name: "Euro / dólar",
    unit: "EUR",
    contract: 100000,
    spread: 0.00009,
    entry: 1.1,
    stop: 1.095,
    tp: 1.11,
  },
  US30: {
    name: "Dow Jones 30",
    unit: "Idx",
    contract: 1,
    spread: 2.2,
    entry: 42000,
    stop: 41900,
    tp: 42200,
  },
  US500: {
    name: "S&P 500",
    unit: "Idx",
    contract: 1,
    spread: 0.5,
    entry: 5800,
    stop: 5780,
    tp: 5840,
  },
  GBPJPY: {
    name: "Libra / yen",
    unit: "GBP",
    contract: 100000,
    spread: 0.02,
    entry: 195,
    stop: 194,
    tp: 197,
  },
  USOIL: {
    name: "WTI",
    unit: "BBL",
    contract: 1000,
    spread: 0.04,
    entry: 75,
    stop: 74,
    tp: 77,
  },
  ETHUSD: {
    name: "Ethereum",
    unit: "ETH",
    contract: 1,
    spread: 1.6,
    entry: 3000,
    stop: 2975,
    tp: 3050,
  },
  USDCAD: {
    name: "Dólar / dólar canadiense",
    unit: "USD",
    contract: 100000,
    spread: 0.00012,
    entry: 1.37,
    stop: 1.365,
    tp: 1.38,
  },
  AUDUSD: {
    name: "Dólar australiano / dólar",
    unit: "AUD",
    contract: 100000,
    spread: 0.0001,
    entry: 0.67,
    stop: 0.665,
    tp: 0.68,
  },
  EURJPY: {
    name: "Euro / yen",
    unit: "EUR",
    contract: 100000,
    spread: 0.015,
    entry: 165,
    stop: 164,
    tp: 167,
  },
};

export const CFD_SOURCES = [
  {
    label: "Exness · Standard Cent",
    url: "https://get.exness.help/hc/en-us/articles/17537782786588-Standard-Cent-account",
  },
  {
    label: "Exness · índices y mínimos",
    url: "https://get.exness.help/hc/en-us/articles/17854383867548-Indices",
  },
  {
    label: "Exness · cambios de margen",
    url: "https://get.exness.help/hc/es/articles/30743728061724-El-apalancamiento-aumenta-para-determinados-instrumentos",
  },
  {
    label: "Exness · cripto y mínimos",
    url: "https://get.exness.help/hc/en-us/articles/17854191888540-Cryptocurrencies",
  },
  {
    label: "Exness · energía",
    url: "https://get.exness.help/hc/en-us/articles/17854173039388-Commodities",
  },
  {
    label: "Vantage · contratos de oro",
    url: "https://latam.vantagemarkets.com/es/academy/xauusd-risk-management/",
  },
];

export function instrumentProfile(broker: CfdBroker, id: InstrumentId) {
  const instrument = INSTRUMENTS[id];
  const index = INDEX_IDS.includes(id);
  const crypto = id === "BTCUSD" || id === "ETHUSD";
  return {
    ...instrument,
    symbol: id === "USTEC" && broker === "Vantage" ? "NAS100" : id,
    centAvailable:
      !index && id !== "USOIL" && !(crypto && broker === "Vantage"),
    minimum:
      broker === "Exness"
        ? id === "US500"
          ? 0.14
          : index
            ? 0.05
            : id === "ETHUSD"
              ? 0.1
              : 0.01
        : 0.01,
    step: 0.01,
    leverageCap:
      broker === "Exness" ? (index ? 400 : id === "USOIL" ? 2000 : null) : null,
  };
}
