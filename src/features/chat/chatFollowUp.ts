export function extractLeverage(message: string): number | null {
  const match =
    message.match(/\b(\d+(?:[.,]\d+)?)\s*x\b/i) ??
    message.match(/\bx\s*(\d+(?:[.,]\d+)?)\b/i) ??
    message.match(/(?:apala(?:n)?c\w*|leverage)\D{0,12}x?\s*(\d+(?:[.,]\d+)?)/i);

  if (!match) return null;

  const leverage = Number(match[1].replace(",", "."));
  return Number.isFinite(leverage) && leverage > 0 ? leverage : null;
}

export function isMarginQuestion(message: string): boolean {
  return /\b(?:margen|margin|garant[ií]a|capital\s+necesario)\b/i.test(message);
}
