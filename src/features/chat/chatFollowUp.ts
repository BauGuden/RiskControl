export function extractLeverage(message: string): number | null {
  const match =
    message.match(
      /(?:apalanc\w*|leverage)\s*(?:de|:|=)?\s*1\s*:\s*(\d+(?:[.,]\d+)?)/i,
    ) ??
    (!/\b(?:tp|rr|ratio)\b/i.test(message)
      ? message.match(/\b1\s*:\s*(\d+(?:[.,]\d+)?)/)
      : null) ??
    message.match(/\b(\d+(?:[.,]\d+)?)\s*x\b/i) ??
    message.match(/\bx\s*(\d+(?:[.,]\d+)?)\b/i) ??
    message.match(
      /(?:apala(?:n)?c\w*|leverage)\D{0,12}x?\s*(\d+(?:[.,]\d+)?)/i,
    );

  if (!match) return null;

  const leverage = Number(match[1].replace(",", "."));
  return Number.isFinite(leverage) && leverage > 0 ? leverage : null;
}

export function isMarginQuestion(message: string): boolean {
  return /\b(?:margen|margin|garant[ií]a|capital\s+necesario)\b/i.test(message);
}

export function isConceptQuestion(message: string): boolean {
  return /^\s*[¿?]*(?:qu[eé]|c[oó]mo|por\s+qu[eé]|cu[aá]l|cu[aá]nto|explica|hola|buenas|ayuda)(?=\s|$|[?.,])/i.test(
    message,
  );
}

export function localCryptoAnswer(message: string): string | null {
  if (!isConceptQuestion(message)) return null;
  if (/(?:entrada|entry)/i.test(message) && /(?:\bsl\b|stop)/i.test(message))
    return null;
  if (/exness|vantage|\bcent\b|\bcfd/i.test(message))
    return "Para lotes Standard/Cent y Exness o Vantage, abre CFDs / MT5 y usa el asistente CFD. Este chat calcula cripto Spot y Futures en unidades con fees del exchange.";
  if (/margen|apalanc/i.test(message))
    return "El margen estimado es el valor nocional dividido por el apalancamiento. Con el mismo tamaño y stop, el apalancamiento cambia el margen, no la pérdida estimada al SL.";
  if (/fees?|comisi[oó]n|maker|taker/i.test(message))
    return "Las fees son comisiones de entrada y salida según exchange, mercado y tipo de orden. La calculadora permite incluirlas en tu presupuesto de riesgo. Comprueba la tarifa de tu cuenta; funding, spread y deslizamiento son costes separados.";
  if (/spread|funding|slippage/i.test(message))
    return "El spread es la diferencia entre compra y venta, funding es un pago periódico de algunos futuros y slippage es la diferencia entre precio esperado y ejecutado. El cálculo cripto usa las fees configuradas y no incluye esos otros costes automáticamente.";
  if (/size|riesgo|stop|\bsl\b|\btp\b|ratio|beneficio/i.test(message))
    return "El tamaño depende de tu presupuesto de pérdida y la distancia entre entrada y SL, más las fees si las incluyes. Indica activo, riesgo, entrada y stop; calcularé size, margen y los TP cripto de 1:1 a 1:5.";
  return "Soy el asistente cripto de RiskControl. Indica activo, riesgo, entrada y SL para calcular sin conexión a Gemini. Ejemplo: BTC MEXC Futures riesgo 8 entrada 61800 SL 62250.";
}
