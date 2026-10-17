import type { CfdInput, CfdResult } from "./calculateCfd";
import { getCfdTargets } from "./cfdTargets";
import { instrumentProfile, isJpyCross } from "./instruments";

const num = (n: number) => String(Number(n.toPrecision(12)));
const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

export function cfdResultToText(
  input: CfdInput,
  result: CfdResult,
  account = result.selected,
): string {
  const p = instrumentProfile(input.broker, input.instrument);
  const conversionLine = isJpyCross(input.instrument)
    ? `\nConversion USDJPY: ${num(input.usdJpy!)} (referencia constante para SL y TP).`
    : "";
  const heading = `${input.broker} · ${p.symbol}${account?.kind === "cent" ? "c" : ""} · ${input.direction.toUpperCase()}\nEntrada ${num(input.entry)} · SL ${num(input.stop)} · TP ${input.tp === null ? "Sin TP" : num(input.tp)}\nPresupuesto de riesgo: ${usd(input.risk)} (${num(input.risk * 100)} USC). Spread ${input.includeSpread ? "dentro del presupuesto" : "adicional"}: ${num(input.spread)} en precio.`;
  const status = (a: CfdResult["standard"]) =>
    `${a.kind === "cent" ? "Cent" : "Standard"}: ${!a.available ? "no habilitado en este perfil" : !a.viable ? `no ejecutable; teórico ${num(a.exactLots)} lotes; mínimo arriesga ${usd(a.minimumRisk)} con spread` : `${num(a.lots)} lotes; riesgo total ${usd(a.totalRisk)} / ${num(a.totalRisk * 100)} USC`}.`;
  if (!account || !account.viable)
    return `${heading}${conversionLine}\n\nSin volumen ejecutable para la cuenta elegida.\n${status(result.standard)}\n${status(result.cent)}\nConfirma contrato, mínimo y paso en tu servidor.`;
  return `${heading}${conversionLine}\n\nCuenta ${account.kind === "cent" ? "Cent (USC)" : "Standard (USD)"}: ${num(account.lots)} lotes\nEquivalencia: ${num(account.realUnits)} ${p.unit}\nPérdida por recorrido al SL: ${usd(account.stopRisk)}\nSpread estimado: ${usd(account.spreadCost)}\nRiesgo total estimado: ${usd(account.totalRisk)} / ${num(account.totalRisk * 100)} USC\nMargen estimado: ${account.leverage === "unlimited" ? "≈ " : ""}${usd(account.margin)} / ${num(account.margin * 100)} USC · 1:${account.leverage === "unlimited" ? "UNLIMITED" : account.leverage}\nResultado neto en TP: ${account.profit === null ? "Sin TP" : `${usd(account.profit)} / ${num(account.profit * 100)} USC`}\nRiesgo / beneficio neto: ${account.rr === null ? "—" : `1:${num(account.rr)}`}\n\nComparación de cuentas\n${status(result.standard)}\n${status(result.cent)}\n\nObjetivos netos alternativos para toda la posición\n${getCfdTargets(
    input,
  )
    .map(
      (t) =>
        `1:${t.ratio}: ${t.price === null ? "no alcanzable" : `TP ${num(t.price)} · +${usd(t.netPerUnit! * account.realUnits)} / ${num(t.netPerUnit! * account.realUnits * 100)} USC`}`,
    )
    .join(
      "\n",
    )}\n\nContrato Standard ${num(input.contract)}, mínimo ${num(input.minimum)}, paso ${num(input.step)}. Cálculo estimado; confirma las especificaciones del servidor. No incluye swap, comisiones ni deslizamiento.`;
}
