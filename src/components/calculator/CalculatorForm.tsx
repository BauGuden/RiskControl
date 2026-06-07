import { Calculator, RotateCcw } from "lucide-react";
import { BROKER_OPTIONS, getBrokerLabel, getPresetNote } from "../../data/fees";
import type { CalculatorFormState } from "../../features/calculator/formState";
import { TextInput } from "../ui/TextInput";
import type { Broker, Market, OrderRole, ValidationError } from "../../types";
import { SymbolPairInput } from "./SymbolPairInput";

type CalculatorFormProps = {
  form: CalculatorFormState;
  errors: ValidationError[];
  onUpdate: <K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) => void;
  onCalculate: () => void;
  onClear: () => void;
};

export function CalculatorForm({ form, errors, onUpdate, onCalculate, onClear }: CalculatorFormProps) {
  const presetNote = getPresetNote(form.broker);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCalculate();
  }

  return (
    <section className="panel min-w-0 p-5 sm:p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="label">Mercado</label>
          <div className="grid grid-cols-2 border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
            {(["spot", "futures"] as Market[]).map((market) => (
              <button
                className={form.market === market ? "segmented-active" : "segmented"}
                key={market}
                onClick={() => onUpdate("market", market)}
                type="button"
              >
                {market === "futures" ? "Futures" : "Spot"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SymbolPairInput
            errors={errors}
            onChange={(value) => onUpdate("symbol", value.toUpperCase())}
            value={form.symbol}
          />

          <div>
            <label className="label" htmlFor="broker">
              Broker
            </label>
            <select
              className="input"
              id="broker"
              onChange={(event) => onUpdate("broker", event.target.value as Broker)}
              value={form.broker}
            >
              {BROKER_OPTIONS.map((broker) => (
                <option key={broker} value={broker}>
                  {getBrokerLabel(broker)}
                </option>
              ))}
            </select>
            {presetNote ? <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{presetNote}</p> : null}
          </div>

          <TextInput
            errors={errors}
            id="entry"
            label="Precio de entrada"
            onChange={(value) => onUpdate("entry", value)}
            placeholder="60000.00"
            type="number"
            value={form.entry}
          />

          <TextInput
            errors={errors}
            id="stop"
            label="Stop loss"
            onChange={(value) => onUpdate("stop", value)}
            placeholder="58000.00"
            type="number"
            value={form.stop}
          />

          <TextInput
            errors={errors}
            help="Cantidad máxima que aceptas perder si toca el stop."
            id="risk"
            label="Riesgo (USDT)"
            onChange={(value) => onUpdate("risk", value)}
            placeholder="8.00"
            type="number"
            value={form.risk}
          />

          {form.market === "futures" ? (
            <TextInput
              errors={errors}
              help="Solo estima margen requerido; no cambia el riesgo."
              id="leverage"
              label="Leverage"
              onChange={(value) => onUpdate("leverage", value)}
              placeholder="10"
              type="number"
              value={form.leverage}
            />
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="entryRole">
              Orden entrada
            </label>
            <select
              className="input"
              id="entryRole"
              onChange={(event) => onUpdate("entryRole", event.target.value as OrderRole)}
              value={form.entryRole}
            >
              <option value="taker">Taker</option>
              <option value="maker">Maker</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="exitRole">
              Orden salida
            </label>
            <select
              className="input"
              id="exitRole"
              onChange={(event) => onUpdate("exitRole", event.target.value as OrderRole)}
              value={form.exitRole}
            >
              <option value="taker">Taker</option>
              <option value="maker">Maker</option>
            </select>
          </div>

          <TextInput
            errors={errors}
            id="feeInPct"
            label="Fee entrada (%)"
            onChange={(value) => onUpdate("feeInPct", value)}
            placeholder="0.05"
            type="number"
            value={form.feeInPct}
          />

          <TextInput
            errors={errors}
            id="feeOutPct"
            label="Fee salida (%)"
            onChange={(value) => onUpdate("feeOutPct", value)}
            placeholder="0.05"
            type="number"
            value={form.feeOutPct}
          />
        </div>

        <label className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          <input
            checked={form.includeFeesInRisk}
            className="mt-1 h-4 w-4 accent-teal-700"
            onChange={(event) => onUpdate("includeFeesInRisk", event.target.checked)}
            type="checkbox"
          />
          <span>Ajustar tamaño para que pérdida por precio + fees sea igual al riesgo.</span>
        </label>

        {errors.length > 0 ? (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
            Revisa los campos marcados antes de calcular.
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" type="submit">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Calcular
          </button>
          <button className="btn-secondary" onClick={onClear} type="button">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}
