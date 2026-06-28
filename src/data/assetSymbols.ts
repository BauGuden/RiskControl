import { SYMBOL_PAIRS } from "./symbolPairs";

const QUOTE_ASSET_PATTERN = /(?:USDT|USDC|USD)$/;

const EXTRA_ALIASES: Record<string, string> = {
  ETHER: "ETH",
  PEPE: "PEPE",
  RIPPLE: "XRP",
  SHIB: "SHIB",
  MATIC: "POL",
  WIF: "WIF",
  XBT: "BTC"
};

function normalizeAssetText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[_/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const aliasToBaseAsset = new Map<string, string>();

for (const pair of SYMBOL_PAIRS) {
  aliasToBaseAsset.set(normalizeAssetText(pair.symbol), pair.baseAsset);
  aliasToBaseAsset.set(normalizeAssetText(pair.baseAsset), pair.baseAsset);
  aliasToBaseAsset.set(normalizeAssetText(pair.name), pair.baseAsset);
}

for (const [alias, baseAsset] of Object.entries(EXTRA_ALIASES)) {
  aliasToBaseAsset.set(alias, baseAsset);
}

const aliasesBySpecificity = [...aliasToBaseAsset.keys()].sort((a, b) => b.length - a.length);

export function normalizeTradingSymbol(value: string): string | null {
  const normalized = normalizeAssetText(value);
  if (!normalized) return null;

  const directBaseAsset = aliasToBaseAsset.get(normalized);
  if (directBaseAsset) return `${directBaseAsset}USDT`;

  const compact = normalized.replace(/\s/g, "");
  const compactBaseAsset = aliasToBaseAsset.get(compact);
  if (compactBaseAsset) return `${compactBaseAsset}USDT`;

  const withoutQuote = compact.replace(QUOTE_ASSET_PATTERN, "");
  const quotedBaseAsset = aliasToBaseAsset.get(withoutQuote);
  if (quotedBaseAsset) return `${quotedBaseAsset}USDT`;

  return /^[A-Z0-9]{2,12}$/.test(withoutQuote) ? `${withoutQuote}USDT` : null;
}

export function findTradingSymbolInText(message: string): string | null {
  const normalizedMessage = normalizeAssetText(message);

  for (const alias of aliasesBySpecificity) {
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const aliasPattern = new RegExp(`(?:^|[^A-Z0-9])${escapedAlias}(?:[^A-Z0-9]|$)`);

    if (aliasPattern.test(normalizedMessage)) {
      return `${aliasToBaseAsset.get(alias)}USDT`;
    }
  }

  const explicitPair = normalizedMessage.match(
    /(?:^|[^A-Z0-9])([A-Z0-9]{2,12})\s*(?:USDT|USDC|USD)(?:[^A-Z0-9]|$)/
  );
  if (explicitPair?.[1]) return normalizeTradingSymbol(explicitPair[1]);

  const cashtag = normalizedMessage.match(/(?:^|[^A-Z0-9])\$([A-Z][A-Z0-9]{1,11})(?:[^A-Z0-9]|$)/);
  if (cashtag?.[1]) return normalizeTradingSymbol(cashtag[1]);

  return null;
}
