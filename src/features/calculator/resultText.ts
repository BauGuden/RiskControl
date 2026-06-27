import { getBrokerLabel } from "../../data/fees";
import { formatCurrency, formatNumber, formatPct } from "../../lib/format";
import type { CalculatorResult } from "../../types";

export function resultToText(
  result: CalculatorResult,
  feeInPct: string,
  feeOutPct: string,
  leverage?: string | number
): string {
  const leverageValue = Number(leverage);
  const leverageLine =
    Number.isFinite(leverageValue) && leverageValue > 0
      ? `Apalancamiento para margen: ${formatNumber(leverageValue)}x\n`
      : "";
  const marginLine =
    result.market === "futures"
      ? `${leverageLine}Margen estimado: ${formatCurrency(result.marginRequired ?? 0)}\n`
      : "";

  return `Par: ${result.symbol}
Mercado: ${result.market === "futures" ? "Futures" : "Spot"}
Broker: ${getBrokerLabel(result.broker)}
Tipo: ${result.side}
Entrada: ${formatNumber(result.entryPrice)}
Stop loss: ${formatNumber(result.stopPrice)}
Riesgo configurado: ${formatCurrency(result.riskBudget)}

Distancia al stop: ${formatNumber(result.distance)}
Size recomendado: ${formatNumber(result.sizeUnits)} ${result.baseAsset}
Break even con fees: ${formatNumber(result.breakEvenPrice)}
${marginLine}
Fees estimadas
- Entrada: ${formatCurrency(result.feeOpen)} (${formatPct(Number(feeInPct))})
- Salida en stop: ${formatCurrency(result.feeCloseAtStop)} (${formatPct(Number(feeOutPct))})
- Total fees en stop: ${formatCurrency(result.feesTotalAtStop)}
- Incluidas dentro del riesgo: ${result.includeFeesInRisk ? "Sí" : "No"}

Pérdida por precio: ${formatCurrency(result.lossByPrice)}
Pérdida total con fees: ${formatCurrency(result.totalLossAtStop)}

${result.targets
    .map(
      (target) =>
        `TP${target.rr} (1:${target.rr}): ${formatNumber(target.price)} | Bruta: ${formatCurrency(
          target.profitGross
        )} | Neta: ${formatCurrency(target.profitNet)}`
    )
    .join("\n")}

Made by DGBAUTISTA`;
}
