import { calculateCfd, type CfdInput } from "./calculateCfd";
import {
  getCfdTargets,
  CFD_TARGET_RATIOS,
  type CfdTargetRatio,
} from "./cfdTargets";
import {
  INSTRUMENTS,
  INSTRUMENT_IDS,
  LEVERAGES,
  instrumentProfile,
  type InstrumentId,
} from "./instruments";

export type CfdChatPatch = Partial<CfdInput> & {
  targetRatio?: CfdTargetRatio;
  tpMode?: "auto" | "manual";
};
export type CfdChatPlan = {
  input: CfdInput;
  targetRatio: CfdTargetRatio;
  tpMode: "auto" | "manual";
};
const USDJPY_REFERENCE =
  /(?:conversi[oó]n|referencia|tipo de cambio)\s*(?:USDJPY\s*)?[:=]?\s*(-?[\d.,]+)/i;

export function findCfdInstrument(text: string): InstrumentId | null {
  text = text.replace(USDJPY_REFERENCE, "");
  const compact = text.replace(/\s*\/\s*/g, "");
  const explicit = INSTRUMENT_IDS.find((id) =>
    new RegExp(`\\b${id}c?\\b`, "i").test(compact),
  );
  if (explicit) return explicit;
  const patterns: [InstrumentId, RegExp][] = [
    [
      "XAUUSD",
      /\b(?:XAU(?:\s*\/\s*USD)?(?:USD)?c?|XAUT(?:USDT)?(?:\.P)?|oro|gold)\b/i,
    ],
    ["BTCUSD", /\b(?:BTC(?:\s*\/\s*USD|USD)?c?|bitcoin)\b/i],
    ["XAGUSD", /\b(?:XAG(?:\s*\/\s*USD)?(?:USD)?c?|plata|silver)\b/i],
    ["GBPUSD", /\b(?:GBP\s*\/?\s*USDc?|libra)\b/i],
    ["USDJPY", /\b(?:USD\s*\/?\s*JPYc?|yen)\b/i],
    ["USTEC", /\b(?:USTECc?|NAS100|NASDAQ(?:\s*100)?|US100)\b/i],
    ["EURUSD", /\b(?:EUR\s*\/?\s*USDc?|euro)\b/i],
    ["US30", /\b(?:US30|DJ30|dow(?:\s*jones)?(?:\s*30)?)\b/i],
    ["US500", /\b(?:US500|SP500|S&P\s*500)\b/i],
    ["GBPJPY", /\bGBP\s*\/?\s*JPYc?\b/i],
    ["USOIL", /\b(?:USOIL|WTI|petr[oó]leo)\b/i],
    ["ETHUSD", /\b(?:ETH(?:\s*\/?\s*USD)?c?|ethereum)\b/i],
    ["USDCAD", /\bUSD\s*\/?\s*CADc?\b/i],
    ["AUDUSD", /\bAUD\s*\/?\s*USDc?\b/i],
    ["EURJPY", /\bEUR\s*\/?\s*JPYc?\b/i],
  ];
  return patterns.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}

function parseNumeric(
  raw: string,
  price: boolean,
  instrument: InstrumentId | null,
): number {
  let value = raw.trim().replace(/[.,]+$/, "");
  if (value.includes(",") && value.includes(".")) {
    const decimal = value.lastIndexOf(",") > value.lastIndexOf(".") ? "," : ".";
    value = value
      .split(decimal === "," ? "." : ",")
      .join("")
      .replace(decimal, ".");
  } else if (value.includes(",")) {
    value =
      /^-?\d{1,3}(?:,\d{3})+$/.test(value) &&
      !(
        price &&
        [
          "EURUSD",
          "GBPUSD",
          "USDJPY",
          "GBPJPY",
          "USDCAD",
          "AUDUSD",
          "EURJPY",
          "XAGUSD",
          "USOIL",
        ].includes(instrument ?? "")
      )
        ? value.replace(/,/g, "")
        : value.replace(",", ".");
  } else if (
    price &&
    ["XAUUSD", "BTCUSD", "ETHUSD", "USTEC", "US30", "US500"].includes(
      instrument ?? "",
    ) &&
    /^\d{1,3}(?:\.\d{3})+$/.test(value)
  ) {
    value = value.replace(/\./g, "");
  }
  return Number(value);
}

export function parseCfdMessage(
  message: string,
  instrumentHint?: InstrumentId,
): CfdChatPatch {
  const patch: CfdChatPatch = {};
  const conversion = message.match(USDJPY_REFERENCE);
  if (conversion) patch.usdJpy = parseNumeric(conversion[1], true, "USDJPY");
  const instrument = findCfdInstrument(message);
  if (instrument) patch.instrument = instrument;
  const hint = instrument ?? instrumentHint ?? null;
  const get = (pattern: RegExp, price = true) => {
    const match = message.match(pattern);
    return match ? parseNumeric(match[1], price, hint) : undefined;
  };
  const risk =
    get(
      /(?:riesgo|arriesg\w*|perder)\s*(?:hasta|de)?\s*\$?\s*(-?[\d.,]+)/i,
      false,
    ) ?? get(/\$\s*(-?[\d.,]+)\s*(?:de\s+)?riesgo/i, false);
  const entry = get(
    /(?:entrada|entry|entro|entrar)\s*(?:en|a|de|:|=)?\s*\$?\s*(-?[\d.,]+)/i,
  );
  const stop = get(
    /(?:stop\s*loss|stop|\bSL(?=\s|[:=\d-]))\s*(?:en|a|de|:|=)?\s*\$?\s*(-?[\d.,]+)/i,
  );
  const tp = get(
    /(?:take\s*profit|\bTP(?=\s|[:=\d-]))(?!\s*1\s*:)\s*(?:en|a|de|:|=)?\s*\$?\s*(-?[\d.,]+)/i,
  );
  const spread = get(/\bspread\s*(?:de|:|=)?\s*\$?\s*(-?[\d.,]+)/i);
  const riskInCents =
    /(?:riesgo|arriesg\w*|perder)\s*(?:hasta|de)?\s*\$?\s*-?[\d.,]+\s*(?:USC|centavos)\b/i.test(
      message,
    );
  if (risk !== undefined) patch.risk = riskInCents ? risk / 100 : risk;
  if (entry !== undefined) patch.entry = entry;
  if (stop !== undefined) patch.stop = stop;
  if (tp !== undefined) {
    patch.tp = tp;
    patch.tpMode = "manual";
  }
  if (spread !== undefined) patch.spread = spread;
  if (/\bexness\b/i.test(message)) patch.broker = "Exness";
  if (/\bvantage\b/i.test(message)) patch.broker = "Vantage";
  if (
    riskInCents ||
    /\b(?:cent|USC|centavos)\b|\b(?:XAUUSD|BTCUSD|ETHUSD|EURUSD|XAGUSD|GBPUSD|USDJPY|GBPJPY|USDCAD|AUDUSD|EURJPY)c\b/i.test(
      message,
    )
  )
    patch.account = "cent";
  else if (/\bstandard\b/i.test(message)) patch.account = "standard";
  if (
    /\b(?:auto(?:m[aá]tic[ao])?|detectar)\b.*\bcuenta\b|\bcuenta\s+auto/i.test(
      message,
    )
  )
    patch.account = "auto";
  if (/\b(?:long|buy|compr[ao]|comprar)\b/i.test(message))
    patch.direction = "long";
  if (/\b(?:short|sell|venta|vender|corto)\b/i.test(message))
    patch.direction = "short";
  const ratio =
    message.match(
      /\b(?:rr|ratio|objetivo|tp)\s*(?:neto\s*)?(?:de|a|en|:|=)?\s*1\s*:\s*(\d+)\b/i,
    ) ??
    (!/apalanc|leverage/i.test(message)
      ? message.match(/\b1\s*:\s*(2|3|4|5|6|7|8|9|10)\b/)
      : null);
  if (ratio) {
    patch.targetRatio = Number(ratio[1]) as CfdTargetRatio;
    patch.tpMode = "auto";
  }
  if (/\b(?:sin\s+tp|sin\s+take\s*profit)\b/i.test(message)) {
    patch.tp = null;
    patch.tpMode = "manual";
  }
  if (
    /\b(?:incluir|incluye|dentro)\b[^\n]{0,30}\bspread\b|\bspread\b[^\n]{0,25}\bdentro\b/i.test(
      message,
    )
  )
    patch.includeSpread = true;
  if (/\bspread\b[^\n]{0,25}\b(?:adicional|fuera)\b/i.test(message))
    patch.includeSpread = false;
  const leverage =
    message.match(
      /(?:apalanc\w*|leverage)\s*(?:de|:|=)?\s*(?:1\s*:\s*)?(\d+)\s*x?\b/i,
    ) ??
    message.match(/\b1\s*:\s*(20|50|100|200|400|500|600|800|1000|2000)\b/) ??
    message.match(/\b(\d+)\s*x\b/i);
  if (leverage) patch.leverage = Number(leverage[1]) as CfdInput["leverage"];
  if (/\b(?:unlimited|ilimitado)\b/i.test(message))
    patch.leverage = "unlimited";
  return patch;
}

export function normalizeCfdChatPatch(value: unknown): CfdChatPatch {
  if (!value || typeof value !== "object")
    throw new Error("Respuesta CFD inválida.");
  const raw = value as Record<string, unknown>;
  const patch: CfdChatPatch = {};
  if (raw.instrument !== undefined && raw.instrument !== null) {
    if (
      typeof raw.instrument !== "string" ||
      !Object.prototype.hasOwnProperty.call(INSTRUMENTS, raw.instrument)
    )
      throw new Error("Activo CFD no admitido.");
    patch.instrument = raw.instrument as InstrumentId;
  }
  for (const key of [
    "risk",
    "entry",
    "stop",
    "spread",
    "contract",
    "minimum",
    "step",
    "usdJpy",
  ] as const) {
    if (raw[key] !== undefined && raw[key] !== null) {
      if (typeof raw[key] !== "number" || !Number.isFinite(raw[key]))
        throw new Error(`Valor CFD inválido: ${key}.`);
      patch[key] = raw[key];
    }
  }
  if (raw.tp !== undefined) {
    if (
      raw.tp !== null &&
      (typeof raw.tp !== "number" || !Number.isFinite(raw.tp))
    )
      throw new Error("TP inválido.");
    patch.tp = raw.tp as number | null;
  }
  for (const [key, choices] of [
    ["broker", ["Exness", "Vantage"]],
    ["account", ["auto", "standard", "cent"]],
    ["direction", ["long", "short"]],
    ["tpMode", ["auto", "manual"]],
  ] as const) {
    if (raw[key] !== undefined && raw[key] !== null) {
      if (!(choices as readonly unknown[]).includes(raw[key]))
        throw new Error(`Valor CFD inválido: ${key}.`);
      Object.assign(patch, { [key]: raw[key] });
    }
  }
  if (raw.includeSpread !== undefined && raw.includeSpread !== null) {
    if (typeof raw.includeSpread !== "boolean")
      throw new Error("Modo spread inválido.");
    patch.includeSpread = raw.includeSpread;
  }
  if (raw.leverage !== undefined && raw.leverage !== null) {
    if (!(LEVERAGES as readonly unknown[]).includes(raw.leverage))
      throw new Error("Apalancamiento no admitido en CFD.");
    patch.leverage = raw.leverage as CfdInput["leverage"];
  }
  if (raw.targetRatio !== undefined && raw.targetRatio !== null) {
    if (!(CFD_TARGET_RATIOS as readonly unknown[]).includes(raw.targetRatio))
      throw new Error("El ratio CFD debe estar entre 1:2 y 1:10.");
    patch.targetRatio = raw.targetRatio as CfdTargetRatio;
  }
  return patch;
}

export function prepareCfdChatPlan(
  patch: CfdChatPatch,
  defaults: CfdInput,
  base?: CfdChatPlan,
): CfdChatPlan {
  patch = normalizeCfdChatPatch(patch);
  const instrument = patch.instrument ?? base?.input.instrument;
  const missing = [
    !instrument ? "el activo" : null,
    ...(["risk", "entry", "stop"] as const).map((key) =>
      patch[key] === undefined &&
      (!base ||
        (patch.instrument && patch.instrument !== base.input.instrument))
        ? { risk: "el riesgo", entry: "la entrada", stop: "el stop loss" }[key]
        : null,
    ),
  ].filter(Boolean);
  if (missing.length)
    throw new Error(
      `Me falta ${missing.join(", ")}. Ejemplo: oro Exness riesgo 1 entrada 4100 SL 4080 TP 1:3.`,
    );
  const broker = patch.broker ?? base?.input.broker ?? defaults.broker;
  const profile = instrumentProfile(broker, instrument!);
  const previous = base?.input ?? defaults;
  const changedProfile =
    previous.instrument !== instrument || previous.broker !== broker;
  const {
    targetRatio: requestedRatio,
    tpMode: requestedMode,
    ...inputPatch
  } = patch;
  const input: CfdInput = {
    ...previous,
    ...(changedProfile
      ? {
          contract: profile.contract,
          minimum: profile.minimum,
          step: profile.step,
          spread: profile.spread,
        }
      : {}),
    ...inputPatch,
    instrument: instrument!,
    broker,
  };
  if (
    !patch.direction &&
    (patch.entry !== undefined || patch.stop !== undefined || !base)
  )
    input.direction = input.stop > input.entry ? "short" : "long";
  const targetRatio = requestedRatio ?? base?.targetRatio ?? 2;
  const tpMode = requestedMode ?? base?.tpMode ?? "auto";
  if (tpMode === "auto") {
    const target = getCfdTargets(input).find((t) => t.ratio === targetRatio)!;
    input.tp = target.price;
    if (target.price === null && calculateCfd({ ...input, tp: null }).ok)
      throw new Error(
        "El TP elegido no tiene un precio positivo alcanzable. Elige otro ratio o revisa el SL.",
      );
  }
  const result = calculateCfd(input);
  if (!result.ok) throw new Error(result.errors.join(" "));
  return { input, targetRatio, tpMode };
}

export function isCfdFollowUp(message: string) {
  return (
    /\b(?:cambia|ajusta|ahora|mism[ao]|formulario|actual|recalcula|en vez|y con)\b/i.test(
      message,
    ) ||
    (!/(?:entrada|entry|riesgo|arriesg)/i.test(message) &&
      /(?:1\s*:|\bspread\b|\bapalanc|\bcent\b|\bstandard\b|\bmargen\b|conversi[oó]n|referencia|\d+\s*x\b)/i.test(
        message,
      ))
  );
}
