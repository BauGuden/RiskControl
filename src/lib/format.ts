export function formatNumber(value: number, decimals = 8): string {
  if (!Number.isFinite(value)) return "N/A";
  const abs = Math.abs(value);
  if (abs >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (abs >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function formatCurrency(value: number): string {
  return `${formatNumber(value)} USDT`;
}

export function formatPct(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  return `${value.toFixed(4)}%`;
}
