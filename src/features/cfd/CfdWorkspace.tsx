import { useEffect, useId, useState, type ReactNode } from "react";
import { getCfdTargets, type CfdTargetRatio } from "./cfdTargets";
import { CfdTargetsPanel, CfdTradeMap } from "./CfdTargetsPanel";
import { CfdTradeChat } from "./CfdTradeChat";
import { CfdCopyButton } from "./CfdCopyButton";
import { cfdResultToText } from "./cfdResultText";
import type { CfdChatPlan } from "./cfdChat";
import {
  ArrowDownUp,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Copy,
  FlaskConical,
  Info,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  calculateCfd,
  effectiveLeverage,
  type CfdInput,
  type CfdResult,
} from "./calculateCfd";
import {
  CFD_SOURCES,
  INSTRUMENT_IDS,
  INDEX_IDS,
  isJpyCross,
  LEVERAGES,
  instrumentProfile,
  type AccountPreference,
  type CfdBroker,
  type InstrumentId,
  type Leverage,
} from "./instruments";

const number = (value: number, digits = 6) =>
  value.toLocaleString("en-US", { maximumFractionDigits: digits });
const usd = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
const leverageLabel = (value: number | "unlimited") =>
  value === "unlimited" ? "1:UNLIMITED" : `1:${value}`;
type Fields = {
  risk: string;
  entry: string;
  stop: string;
  tp: string;
  spread: string;
  contract: string;
  minimum: string;
  step: string;
};
const example: Fields = {
  risk: "1",
  entry: "4100",
  stop: "4080",
  tp: "4120",
  spread: "0.2",
  contract: "100",
  minimum: "0.01",
  step: "0.01",
};

function Field({
  label,
  value,
  onChange,
  hint,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  readOnly?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        className="input font-mono"
        id={id}
        type="number"
        step="any"
        inputMode="decimal"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs muted">
          {hint}
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-xs">
      <dt className="muted">{label}</dt>
      <dd
        className={`text-right font-mono font-semibold ${accent ? "text-teal-700 dark:text-teal-300" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function AccountCard({
  account,
  selected,
  symbol,
  minimum,
  unit,
  input,
  result,
}: {
  account: CfdResult["standard"];
  selected: boolean;
  symbol: string;
  minimum: number;
  unit: string;
  input: CfdInput;
  result: CfdResult;
}) {
  const cent = account.kind === "cent";
  return (
    <article
      className={`relative min-w-0 rounded-2xl border p-5 ${selected ? "border-teal-500 bg-teal-50/70 ring-1 ring-teal-500 dark:bg-teal-400/[0.06]" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider">
          {cent ? "Cuenta Cent" : "Cuenta Standard"}{" "}
          <span className="muted">/ {cent ? "USC" : "USD"}</span>
        </p>
        {selected && (
          <span className="flex items-center gap-1 rounded-full bg-teal-600 px-2 py-1 text-[10px] font-bold text-white">
            <Check size={11} /> CUENTA ELEGIDA
          </span>
        )}
      </div>
      <p
        className={`break-words font-mono text-3xl font-bold tracking-tight ${account.viable ? "" : "text-slate-400 dark:text-slate-500"}`}
      >
        {account.viable ? number(account.lots, 10) : "—"}
        <span className="ml-2 text-xs font-medium muted">
          {cent ? "lotes Cent" : "lotes"}
        </span>
      </p>
      <p className="mt-2 text-xs muted">
        {symbol}
        {cent ? "c" : ""} ·{" "}
        {cent && ["BTCUSD", "ETHUSD"].includes(symbol)
          ? "solo MT5"
          : "MT4 / MT5"}
      </p>
      {!account.available ? (
        <p className="cfd-warning mt-5">
          {["BTCUSD", "ETHUSD"].includes(symbol)
            ? `${symbol} no está habilitado en Vantage Cent en este perfil.`
            : `${symbol} requiere Standard en este perfil. Confirma la oferta Cent y su contrato en tu servidor.`}
        </p>
      ) : !account.viable ? (
        <p className="cfd-warning mt-5">
          No ejecutable: necesitas {number(account.exactLots, 10)} lotes; el
          mínimo es {number(minimum)}. El mínimo arriesga{" "}
          {usd(account.minimumRisk)} incluyendo spread.
        </p>
      ) : (
        <>
          <dl className="mt-5 divide-y divide-slate-200/70 dark:divide-white/5">
            <Stat
              label="Pérdida por recorrido al SL"
              value={usd(account.stopRisk)}
            />
            <Stat label="Coste del spread" value={usd(account.spreadCost)} />
            <Stat
              label="Riesgo total estimado"
              value={usd(account.totalRisk)}
            />
            {cent && (
              <Stat
                label="Riesgo en centavos"
                value={`${number(account.totalRisk * 100, 4)} USC`}
              />
            )}
            <Stat
              label="Resultado neto en TP"
              value={account.profit === null ? "Sin TP" : usd(account.profit)}
              accent={account.profit !== null && account.profit > 0}
            />
            {cent && account.profit !== null && (
              <Stat
                label="Resultado TP en USC"
                value={`${number(account.profit * 100, 4)} USC`}
              />
            )}
            <Stat
              label="Riesgo / beneficio neto"
              value={account.rr === null ? "—" : `1 : ${number(account.rr, 2)}`}
            />
            <Stat
              label="Exposición real"
              value={`${number(account.realUnits)} ${unit}`}
            />
          </dl>
        </>
      )}
      <p className="mt-4 text-[11px] muted">
        Teórico: {number(account.exactLots, 10)} lotes
        {cent ? " Cent" : " Standard"}.{" "}
        {account.viable && "Volumen redondeado hacia abajo."}
      </p>
      {account.viable && (
        <CfdCopyButton
          text={cfdResultToText(input, result, account)}
          label={cent ? "Copiar cuenta Cent" : "Copiar cuenta Standard"}
          compact
        />
      )}
    </article>
  );
}

export function CfdWorkspace() {
  const [broker, setBroker] = useState<CfdBroker>("Exness");
  const [instrument, setInstrument] = useState<InstrumentId>("XAUUSD");
  const [preference, setPreference] = useState<AccountPreference>("auto");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [fields, setFields] = useState<Fields>(example);
  const [leverage, setLeverage] = useState<Leverage>(100);
  const [includeSpread, setIncludeSpread] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copiar plan");
  const [tpMode, setTpMode] = useState<"auto" | "manual">("auto");
  const [targetRatio, setTargetRatio] = useState<CfdTargetRatio>(2);
  const [usdJpy, setUsdJpy] = useState("");
  const profile = instrumentProfile(broker, instrument);
  const update = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setCopyLabel("Copiar plan");
  };
  const numeric = (key: keyof Fields) =>
    fields[key].trim() === "" ? NaN : Number(fields[key]);
  const input: CfdInput = {
    broker,
    instrument,
    account: preference,
    direction,
    risk: numeric("risk"),
    entry: numeric("entry"),
    stop: numeric("stop"),
    tp: fields.tp.trim() === "" ? null : numeric("tp"),
    spread: numeric("spread"),
    includeSpread,
    leverage,
    contract: numeric("contract"),
    minimum: numeric("minimum"),
    step: numeric("step"),
    usdJpy: usdJpy.trim() === "" ? undefined : Number(usdJpy),
  };
  const autoTarget = getCfdTargets(input).find(
    (target) => target.ratio === targetRatio,
  )!;
  if (tpMode === "auto") input.tp = autoTarget.price;
  const calculated = calculateCfd(input);
  const result =
    calculated.ok && tpMode === "auto" && autoTarget.price === null
      ? {
          ok: false as const,
          errors: [
            "El TP elegido no es alcanzable con precios positivos para esta operación. Revisa el SL, el spread o selecciona otro ratio.",
          ],
        }
      : calculated;
  useEffect(() => {
    setCopyLabel("Copiar plan");
  }, [
    broker,
    instrument,
    preference,
    direction,
    fields,
    leverage,
    includeSpread,
    tpMode,
    targetRatio,
    usdJpy,
  ]);

  function changeInstrument(next: InstrumentId, nextBroker = broker) {
    const p = instrumentProfile(nextBroker, next);
    setInstrument(next);
    setBroker(nextBroker);
    setDirection("long");
    setCopyLabel("Copiar plan");
    setFields((f) => ({
      ...f,
      entry: String(p.entry),
      stop: String(p.stop),
      tp: String(p.tp),
      spread: String(p.spread),
      contract: String(p.contract),
      minimum: String(p.minimum),
      step: String(p.step),
    }));
    if (nextBroker === "Vantage" && leverage === "unlimited") setLeverage(100);
  }
  function changeBroker(next: CfdBroker) {
    const p = instrumentProfile(next, instrument);
    setBroker(next);
    setFields((f) => ({
      ...f,
      spread: String(p.spread),
      contract: String(p.contract),
      minimum: String(p.minimum),
      step: String(p.step),
    }));
    if (next === "Vantage" && leverage === "unlimited") setLeverage(100);
    setCopyLabel("Copiar plan");
  }
  function loadExample() {
    setBroker("Exness");
    setInstrument("XAUUSD");
    setPreference("auto");
    setDirection("long");
    setFields({ ...example });
    setUsdJpy("");
    setTpMode("auto");
    setTargetRatio(2);
    setLeverage(100);
    setIncludeSpread(false);
    setCopyLabel("Copiar plan");
  }
  function applyChatPlan(plan: CfdChatPlan) {
    const next = plan.input;
    setBroker(next.broker);
    setInstrument(next.instrument);
    setPreference(next.account);
    setDirection(next.direction);
    setLeverage(next.leverage);
    setIncludeSpread(next.includeSpread);
    setTargetRatio(plan.targetRatio);
    setTpMode(plan.tpMode);
    setUsdJpy(next.usdJpy === undefined ? "" : String(next.usdJpy));
    setFields({
      risk: String(next.risk),
      entry: String(next.entry),
      stop: String(next.stop),
      tp: next.tp === null ? "" : String(next.tp),
      spread: String(next.spread),
      contract: String(next.contract),
      minimum: String(next.minimum),
      step: String(next.step),
    });
  }
  async function copyPlan() {
    if (!result.ok || !result.selected) return;
    try {
      await navigator.clipboard.writeText(cfdResultToText(input, result));
      setCopyLabel("Plan copiado");
    } catch {
      setCopyLabel("No se pudo copiar");
    }
  }

  return (
    <div className="cfd-workspace space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="section-kicker">EXNESS / VANTAGE</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            De unidades a lotes. Sin adivinar.
          </h2>
          <p className="mt-2 text-sm muted">
            Define tu riesgo en USD y compara cómo llevarlo a MT5.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn-secondary shrink-0" href="#cfd-assistant">
            <Bot size={15} /> Asistente CFD
          </a>
          <CfdCopyButton
            text={result.ok ? cfdResultToText(input, result) : ""}
            disabled={!result.ok}
          />
          <button
            className="btn-secondary shrink-0"
            type="button"
            onClick={loadExample}
          >
            <FlaskConical size={16} /> Probar ejemplo de $1
          </button>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <section
            className="panel cfd-parameters min-w-0 p-5 sm:p-6"
            aria-label="Parámetros CFD"
          >
            <div className="mb-6 flex items-center gap-2">
              <SlidersHorizontal
                size={17}
                className="text-teal-600 dark:text-teal-300"
              />
              <h3 className="font-bold">Configura tu operación</h3>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold muted">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> LOCAL
              </span>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="cfd-broker">
                    Bróker
                  </label>
                  <select
                    className="input"
                    id="cfd-broker"
                    value={broker}
                    onChange={(e) => changeBroker(e.target.value as CfdBroker)}
                  >
                    <option>Exness</option>
                    <option>Vantage</option>
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="cfd-instrument">
                    Activo / par
                  </label>
                  <select
                    className="input"
                    id="cfd-instrument"
                    value={instrument}
                    onChange={(e) =>
                      changeInstrument(e.target.value as InstrumentId)
                    }
                  >
                    {INSTRUMENT_IDS.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label" htmlFor="cfd-account">
                  Tipo de cuenta preferida
                </label>
                <select
                  className="input"
                  id="cfd-account"
                  value={preference}
                  onChange={(e) =>
                    setPreference(e.target.value as AccountPreference)
                  }
                >
                  <option value="auto">Auto · detectar según riesgo</option>
                  <option value="standard">Standard (USD)</option>
                  <option value="cent">Standard Cent (USC)</option>
                </select>
              </div>
              <div>
                <p className="label" id="cfd-direction-label">
                  Dirección
                </p>
                <div
                  className="grid grid-cols-2 gap-2"
                  role="group"
                  aria-labelledby="cfd-direction-label"
                >
                  {(["long", "short"] as const).map((d) => (
                    <button
                      type="button"
                      key={d}
                      aria-pressed={direction === d}
                      className={`h-10 rounded-xl border text-xs font-extrabold transition ${direction === d ? (d === "long" ? "border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300") : "border-slate-200 muted dark:border-slate-700"}`}
                      onClick={() => setDirection(d)}
                    >
                      {d === "long" ? "↗ LONG / BUY" : "↘ SHORT / SELL"}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Riesgo deseado · USD"
                value={fields.risk}
                onChange={(v) => update("risk", v)}
                hint={
                  Number.isFinite(input.risk) && input.risk > 0
                    ? `${number(input.risk * 100, 4)} USC · 1 USD = 100 USC`
                    : "Ingresa el presupuesto de riesgo."
                }
              />
              {isJpyCross(instrument) && (
                <Field
                  label="USDJPY de referencia"
                  value={usdJpy}
                  onChange={setUsdJpy}
                  hint="Tasa para convertir JPY a USD. Usa la cotización de tu operación; no hay datos en vivo. El TP supone esta tasa constante."
                />
              )}
              <Field
                label="Precio de entrada"
                value={fields.entry}
                onChange={(v) => update("entry", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Stop Loss"
                  value={fields.stop}
                  onChange={(v) => update("stop", v)}
                />
                <Field
                  label={
                    tpMode === "auto"
                      ? "Take Profit · automático"
                      : "Take Profit · opcional"
                  }
                  value={
                    tpMode === "auto"
                      ? autoTarget.price === null
                        ? ""
                        : String(Number(autoTarget.price.toPrecision(14)))
                      : fields.tp
                  }
                  onChange={(v) => update("tp", v)}
                  readOnly={tpMode === "auto"}
                />
              </div>
              <div>
                <div
                  className="mode-switch"
                  role="group"
                  aria-label="Modo Take Profit"
                >
                  <button
                    type="button"
                    className={tpMode === "auto" ? "mode-active" : ""}
                    aria-pressed={tpMode === "auto"}
                    onClick={() => setTpMode("auto")}
                  >
                    TP automático
                  </button>
                  <button
                    type="button"
                    className={tpMode === "manual" ? "mode-active" : ""}
                    aria-pressed={tpMode === "manual"}
                    onClick={() => setTpMode("manual")}
                  >
                    TP manual
                  </button>
                </div>
                {tpMode === "auto" && (
                  <div className="mt-3">
                    <label className="label" htmlFor="cfd-target-ratio">
                      Objetivo riesgo / beneficio neto
                    </label>
                    <select
                      className="input"
                      id="cfd-target-ratio"
                      value={targetRatio}
                      onChange={(e) =>
                        setTargetRatio(Number(e.target.value) as CfdTargetRatio)
                      }
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((ratio) => (
                        <option key={ratio} value={ratio}>
                          1:{ratio} · ganar {ratio} veces el riesgo
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="label" htmlFor="cfd-leverage">
                  Apalancamiento
                </label>
                <select
                  className="input"
                  id="cfd-leverage"
                  value={leverage}
                  onChange={(e) =>
                    setLeverage(
                      e.target.value === "unlimited"
                        ? "unlimited"
                        : (Number(e.target.value) as Leverage),
                    )
                  }
                >
                  {LEVERAGES.map((l) => (
                    <option
                      key={l}
                      value={l}
                      disabled={broker === "Vantage" && l === "unlimited"}
                    >
                      {leverageLabel(l)}
                      {broker === "Vantage" && l === "unlimited"
                        ? " · no disponible"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
                <Field
                  label="Spread estimado · distancia de precio"
                  value={fields.spread}
                  onChange={(v) => update("spread", v)}
                  hint="Referencia editable; no es una cotización en tiempo real."
                />
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-5">
                  <input
                    className="mt-1 h-4 w-4 shrink-0 accent-teal-600"
                    type="checkbox"
                    checked={includeSpread}
                    onChange={(e) => setIncludeSpread(e.target.checked)}
                  />
                  <span>
                    Incluir spread dentro de mi riesgo de $
                    {Number.isFinite(input.risk) ? number(input.risk, 4) : "—"}
                    <span className="block muted">
                      {includeSpread
                        ? "Se reduce el tamaño para cubrir también el spread."
                        : "El spread se suma al riesgo del SL."}
                    </span>
                  </span>
                </label>
              </div>
              <details className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <summary className="cursor-pointer text-xs font-bold">
                  Especificaciones de mi servidor
                </summary>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Contrato · unidades por lote Standard"
                    value={fields.contract}
                    onChange={(v) => update("contract", v)}
                  />
                  {INDEX_IDS.includes(instrument) && (
                    <div className="flex gap-2">
                      {[1, 10, 20].map((v) => (
                        <button
                          type="button"
                          className="icon-btn"
                          key={v}
                          onClick={() => update("contract", String(v))}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Lote mínimo"
                      value={fields.minimum}
                      onChange={(v) => update("minimum", v)}
                    />
                    <Field
                      label="Paso de lote"
                      value={fields.step}
                      onChange={(v) => update("step", v)}
                    />
                  </div>
                  <p className="text-xs leading-5 muted">
                    Cent usa un contrato 100 veces menor. Comprueba contrato,
                    mínimo y paso en la especificación del símbolo de MT5.
                  </p>
                </div>
              </details>
            </div>
          </section>

          <CfdTradeChat
            input={input}
            targetRatio={targetRatio}
            tpMode={tpMode}
            onApply={applyChatPlan}
          />
        </div>

        <div className="min-w-0 space-y-5">
          {!result.ok ? (
            <div className="panel p-6" role="alert">
              <h3 className="font-bold">Revisa tu operación</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-rose-600 dark:text-rose-300">
                {result.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs muted">
                Los resultados se actualizarán cuando los datos sean válidos.
              </p>
            </div>
          ) : (
            <>
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                  <h3 className="flex items-center gap-2 text-sm font-bold">
                    <ArrowDownUp
                      size={16}
                      className="text-teal-600 dark:text-teal-300"
                    />{" "}
                    Puente Cripto → MT5
                  </h3>
                  <span className="font-mono text-xs muted">
                    {profile.symbol} / {direction.toUpperCase()}
                  </span>
                </div>
                <div className="grid items-center gap-5 p-5 sm:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest muted">
                      En unidades · estilo MEXC / Bybit
                    </p>
                    <p className="mt-2 break-words font-mono text-3xl font-bold">
                      {number(result.units)}{" "}
                      <span className="text-sm text-teal-700 dark:text-teal-300">
                        {profile.unit}
                      </span>
                    </p>
                    <p className="mt-2 text-xs muted">
                      {direction === "long" ? "Comprarías" : "Venderías"} esta
                      exposición teórica.
                    </p>
                  </div>
                  <ArrowRight
                    className="hidden text-slate-500 sm:block"
                    size={22}
                  />
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                    <dl>
                      <Stat
                        label="Distancia al SL"
                        value={number(result.distance)}
                      />
                      <Stat
                        label="Sin incluir spread"
                        value={`${number(result.pureUnits)} ${profile.unit}`}
                      />
                      <Stat
                        label="1 lote Cent"
                        value={`${number(input.contract / 100)} ${profile.unit}`}
                      />
                    </dl>
                  </div>
                </div>
                {instrument === "XAUUSD" && (
                  <p className="border-t border-slate-200 px-5 py-3 text-[11px] leading-5 muted dark:border-slate-800">
                    Equivalencia de exposición: 1 XAUT representa
                    aproximadamente 1 oz troy. El CFD de oro y el token XAUT
                    tienen precios, costes y condiciones diferentes.
                  </p>
                )}
              </section>

              <CfdTradeMap input={input} />

              {!result.selected ? (
                <div className="cfd-warning" role="status">
                  {preference === "auto"
                    ? "Ninguna cuenta del perfil permite ejecutar este presupuesto con el lote mínimo. Aumenta el riesgo o revisa las especificaciones."
                    : "La cuenta elegida no permite este volumen. Revisa las tarjetas o selecciona detección automática."}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-500/25 bg-teal-500/5 px-4 py-3 text-sm">
                  <p className="flex items-center gap-2">
                    <ShieldCheck
                      size={18}
                      className="shrink-0 text-teal-600 dark:text-teal-300"
                    />
                    <span>
                      {preference === "auto" ? "Usa" : "Cuenta elegida:"}{" "}
                      <strong>
                        {result.selected.kind === "cent"
                          ? "Cuenta Cent"
                          : "Cuenta Standard"}
                      </strong>{" "}
                      · {number(result.selected.lots, 10)} lotes
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={copyPlan}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300"
                  >
                    <Copy size={13} />
                    {copyLabel}
                  </button>
                </div>
              )}

              <CfdTargetsPanel
                input={input}
                result={result}
                selectedRatio={tpMode === "auto" ? targetRatio : null}
                onSelect={(ratio) => {
                  setTargetRatio(ratio);
                  setTpMode("auto");
                }}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <AccountCard
                  input={input}
                  result={result}
                  account={result.standard}
                  selected={result.selected?.kind === "standard"}
                  symbol={profile.symbol}
                  minimum={input.minimum}
                  unit={profile.unit}
                />
                <AccountCard
                  input={input}
                  result={result}
                  account={result.cent}
                  selected={result.selected?.kind === "cent"}
                  symbol={profile.symbol}
                  minimum={input.minimum}
                  unit={profile.unit}
                />
              </div>

              <section className="panel p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={18}
                    className="text-teal-600 dark:text-teal-300"
                  />
                  <h3 className="font-bold">Apalancamiento y margen</h3>
                </div>
                <p className="mt-2 text-xs leading-5 muted">
                  El apalancamiento cambia el margen retenido. Con el mismo
                  tamaño y SL, el riesgo en USD se mantiene.
                </p>
                {INDEX_IDS.includes(instrument) && broker === "Exness" && (
                  <p className="cfd-warning mt-4">
                    Perfil {instrument}: mínimo {profile.minimum} lotes y tope
                    de margen 1:400. Exness anuncia cambios desde el 24/10/2026;
                    confirma tu servidor. Cent no se simula sin especificaciones
                    verificadas.
                  </p>
                )}
                {result.selected ? (
                  <>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider muted">
                          Margen requerido estimado
                        </p>
                        <p className="mt-2 font-mono text-2xl font-bold">
                          {result.selected.leverage === "unlimited" ? "≈ " : ""}
                          {usd(result.selected.margin)}
                        </p>
                        {result.selected.kind === "cent" && (
                          <p className="mt-1 text-xs muted">
                            {number(result.selected.margin * 100, 4)} USC
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider muted">
                          Exposición nocional
                        </p>
                        <p className="mt-2 font-mono text-xl font-bold">
                          {usd(result.selected.notional)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider muted">
                          Riesgo total fijo
                        </p>
                        <p className="mt-2 font-mono text-xl font-bold text-rose-600 dark:text-rose-300">
                          {usd(result.selected.totalRisk)}
                        </p>
                      </div>
                    </div>
                    <details className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <summary className="flex cursor-pointer items-center justify-between p-4 text-xs font-bold">
                        Comparar los 12 apalancamientos{" "}
                        <ChevronDown size={15} />
                      </summary>
                      <div className="overflow-x-auto">
                        <table className="cfd-table">
                          <caption className="sr-only">
                            Mismo tamaño de posición, margen variable y riesgo
                            constante
                          </caption>
                          <thead>
                            <tr>
                              <th>Apalancamiento</th>
                              <th>Margen USD</th>
                              {result.selected.kind === "cent" && (
                                <th>Margen USC</th>
                              )}
                              <th>Riesgo total USD</th>
                            </tr>
                          </thead>
                          <tbody>
                            {LEVERAGES.map((l) => {
                              const effective = effectiveLeverage(input, l);
                              const margin =
                                effective === "unlimited"
                                  ? 0
                                  : result.selected!.notional / effective;
                              const unavailable =
                                broker === "Vantage" && l === "unlimited";
                              return (
                                <tr
                                  key={l}
                                  className={
                                    l === leverage ? "bg-teal-500/10" : ""
                                  }
                                >
                                  <td>
                                    {leverageLabel(l)}
                                    {l !== effective && !unavailable && (
                                      <span className="block text-[10px] muted">
                                        Efectivo {leverageLabel(effective)}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    {unavailable
                                      ? "No disponible"
                                      : `${effective === "unlimited" ? "≈ " : ""}${usd(margin)}`}
                                  </td>
                                  {result.selected!.kind === "cent" && (
                                    <td>
                                      {unavailable
                                        ? "—"
                                        : number(margin * 100, 4)}
                                    </td>
                                  )}
                                  <td>
                                    {unavailable
                                      ? "—"
                                      : usd(result.selected!.totalRisk)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  </>
                ) : (
                  <p className="mt-5 text-sm muted">
                    El margen estará disponible cuando exista un volumen
                    ejecutable para la cuenta elegida.
                  </p>
                )}
                <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 muted">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  Margen teórico; puede variar por entidad, saldo, horario y
                  HMR. UNLIMITED se representa como ≈ $0,00 solo bajo
                  condiciones elegibles; no garantiza margen cero ni evita
                  liquidaciones.
                </p>
              </section>

              <section className="panel p-5 sm:p-6">
                <h3 className="font-bold">El coste del spread, visible</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs muted">Distancia de precio</p>
                    <p className="mt-2 font-mono font-bold">
                      {number(input.spread)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs muted">Del recorrido al SL</p>
                    <p className="mt-2 font-mono font-bold">
                      {number(result.spreadPercent, 2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs muted">Coste estimado</p>
                    <p className="mt-2 font-mono font-bold">
                      {result.selected ? usd(result.selected.spreadCost) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs muted">Coste en USC</p>
                    <p className="mt-2 font-mono font-bold">
                      {result.selected
                        ? number(result.selected.spreadCost * 100, 4)
                        : "—"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 muted">
                  Modelo: pérdida por distancia al SL + un spread; TP neto =
                  recorrido favorable − spread. Se asumen precios de referencia
                  sin spread incorporado. Si usas precios bid/ask de ejecución
                  que ya lo incluyen, ajusta el spread para evitar contarlo dos
                  veces. No incluye swap, comisiones ni deslizamiento.
                </p>
                {result.spreadPercent >= 100 && (
                  <p className="cfd-warning mt-4">
                    El spread iguala o supera la distancia al SL. Revisa los
                    precios y el coste antes de operar.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CfdReferenceTable() {
  return (
    <details className="panel scroll-mt-24 overflow-hidden" id="contratos">
      <summary className="cursor-pointer p-5 text-sm font-bold sm:p-6">
        Tabla de referencia · contratos, cuentas y spreads
      </summary>
      <div className="overflow-x-auto">
        <table className="cfd-table">
          <caption className="px-6 pb-4 text-left text-xs leading-5 muted">
            Presets del modelo; spreads orientativos del encargo, sin datos en
            vivo. Las especificaciones editadas arriba no modifican esta
            referencia.
          </caption>
          <thead>
            <tr>
              <th>Bróker / símbolo</th>
              <th>1 lote Standard</th>
              <th>1 lote Cent</th>
              <th>Mínimo / paso</th>
              <th>Spread en precio</th>
            </tr>
          </thead>
          <tbody>
            {(["Exness", "Vantage"] as const).flatMap((b) =>
              INSTRUMENT_IDS.map((id) => {
                const p = instrumentProfile(b, id);
                return (
                  <tr key={`${b}-${id}`}>
                    <td>
                      {b}
                      <span className="block font-bold">{p.symbol}</span>
                    </td>
                    <td>
                      {number(p.contract)} {p.unit}
                    </td>
                    <td>
                      {p.centAvailable
                        ? `${number(p.contract / 100)} ${p.unit}${["BTCUSD", "ETHUSD"].includes(id) ? " · MT5" : ""}`
                        : "No habilitado en perfil"}
                    </td>
                    <td>
                      {p.minimum} / {p.step}
                    </td>
                    <td>{number(p.spread)}</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 border-t border-slate-200 p-5 text-xs leading-5 muted dark:border-slate-700">
        <p>
          Vantage: contrato y sufijo Cent son referencias configuradas según el
          encargo; confirma el símbolo real en tu cuenta. Exness publica
          disponibilidad Cent para algunos índices en MT5; este modelo conserva
          índices en Standard hasta verificar su contrato Cent. Los importes son
          estimaciones de pérdida al SL, no una garantía de pérdida máxima.
        </p>
        <p>Consulta de fuentes: 17/10/2026.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {CFD_SOURCES.map((s) => (
            <a
              className="font-bold text-teal-700 underline underline-offset-4 dark:text-teal-300"
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}
